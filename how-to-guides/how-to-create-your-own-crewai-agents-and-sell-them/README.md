---
description: Step by Step Guide to launch your first CrewAI Service and monetising it
icon: head-side-gear
---

# Create your own CrewAI Agents & Sell Them

## **Step 6: Implementing the Masumi Payment Service**

Now that we have **Masumi Payment Service installed & topped up our wallets with some Test ADA**, we will **integrate it with our CrewAI API**. This allows us to:

* **Create AI jobs that require payment**
* **Generate a payment request using Masumi**
* **Execute the CrewAI task once payment is confirmed**
* **Check job and payment status**

📌 **Official Documentation:** [Masumi Payment API Docs](../../technical-documentation/payment-service-api/)

***

### **1. Installing the Masumi Payment Library**

We need to install the **Masumi payment SDK** for Python:

```bash
pip install masumi-crewai
```

This package provides easy integration with Masumi’s decentralized payment system.

***

### **2. Updating `main.py` to Include Payment Processing**

We will modify our existing API to:

1. **Generate a payment request when a job is submitted** (`POST /start_job`)
2. **Check if the payment is confirmed** before running the AI task
3. **Execute the CrewAI task only after payment is received**
4. **Return job and payment status** (`GET /status`)

#### **📌 Updated `main.py`**

Also update the agent identifier in the code for the identifier you obtained in the last part.

```python
import os
import uvicorn
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from masumi_crewai.config import Config
from masumi_crewai.payment import Payment, Amount
from crew_definition import ResearchCrew

# Load environment variables
load_dotenv()

# Retrieve API Keys and URLs
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL")
PAYMENT_API_KEY = os.getenv("PAYMENT_API_KEY")

# Initialize FastAPI
app = FastAPI()

# ─────────────────────────────────────────────────────────────────────────────
# Temporary in-memory job store (DO NOT USE IN PRODUCTION)
# ─────────────────────────────────────────────────────────────────────────────
jobs = {}
payment_instances = {}

# ─────────────────────────────────────────────────────────────────────────────
# Initialize Masumi Payment Config
# ─────────────────────────────────────────────────────────────────────────────
config = Config(
    payment_service_url=PAYMENT_SERVICE_URL,
    payment_api_key=PAYMENT_API_KEY
)

# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────────────────────────────────────
class StartJobRequest(BaseModel):
    text: str

class ProvideInputRequest(BaseModel):
    job_id: str

# ─────────────────────────────────────────────────────────────────────────────
# CrewAI Task Execution
# ─────────────────────────────────────────────────────────────────────────────
async def execute_crew_task(input_data: str) -> str:
    """ Execute a CrewAI task with Research and Writing Agents """
    crew = ResearchCrew()
    result = crew.crew.kickoff({"text": input_data})
    return result

# ─────────────────────────────────────────────────────────────────────────────
# 1) Start Job (MIP-003: /start_job)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/start_job")
async def start_job(data: StartJobRequest):
    """ Initiates a job and creates a payment request """
    job_id = str(uuid.uuid4())
    agent_identifier = "0520e542b4704586b7899e8af207501fd1cfb4d12fc419ede7986de814172d9a1284bbb58a82a82092ec8f682aa4040845472d81d759d246f5d18858" # Set this to your agent identifier

    # Define payment amounts
    amounts = [Amount(amount="10000000", unit="lovelace")]  # 10 tADA as example, set this to the price you want to accept
    
    # Create a payment request using Masumi
    payment = Payment(
        agent_identifier=agent_identifier,
        amounts=amounts,
        config=config,
        identifier_from_purchaser="example_identifier" # Set this to whatever you. Ideally randomly generate a new identifier for each purchase.
    )
    
    payment_request = await payment.create_payment_request()
    payment_id = payment_request["data"]["blockchainIdentifier"]
    payment.payment_ids.add(payment_id)

    # Store job info (Awaiting payment)
    jobs[job_id] = {
        "status": "awaiting_payment",
        "payment_status": "pending",
        "payment_id": payment_id,
        "input_data": data.text,
        "result": None
    }

    async def payment_callback(payment_id: str):
        await handle_payment_status(job_id, payment_id)

    # Start monitoring the payment status
    payment_instances[job_id] = payment
    await payment.start_status_monitoring(payment_callback)

    # Return the response in the required format
    return {
        "status": "success",
        "job_id": job_id,
        "blockchainIdentifier": payment_request["data"]["blockchainIdentifier"],
        "submitResultTime": payment_request["data"]["submitResultTime"],
        "unlockTime": payment_request["data"]["unlockTime"],
        "externalDisputeUnlockTime": payment_request["data"]["externalDisputeUnlockTime"],
        "agentIdentifier": agent_identifier,
        "sellerVkey": "07f2e319dc5796df95406dcce6322c54cd08a62cbc5ee6c579d4e0e6", # Get this seller_vkey from the GET /payment_source/ endpoint in the Masumi Payment Service.
        "identifierFromPurchaser": "example_identifier",
        "amounts": amounts
    }

# ─────────────────────────────────────────────────────────────────────────────
# 2) Process Payment and Execute AI Task
# ─────────────────────────────────────────────────────────────────────────────
async def handle_payment_status(job_id: str, payment_id: str) -> None:
    """ Executes CrewAI task after payment confirmation """
    print(f"Payment {payment_id} completed for job {job_id}, executing task...")
    
    # Update job status to running
    jobs[job_id]["status"] = "running"
    
    # Execute the AI task
    result = await execute_crew_task(jobs[job_id]["input_data"])
    print(f"Crew task completed for job {job_id}")

    # Convert result to string if it's not already
    result_str = str(result)
    
    # Mark payment as completed on Masumi
    # Use a shorter string for the result hash
    result_hash = result_str[:64] if len(result_str) >= 64 else result_str
    await payment_instances[job_id].complete_payment(payment_id, result_hash)
    print(f"Payment completed for job {job_id}")

    # Update job status
    jobs[job_id]["status"] = "completed"
    jobs[job_id]["payment_status"] = "completed"
    jobs[job_id]["result"] = result

    # Stop monitoring payment status
    if job_id in payment_instances:
        payment_instances[job_id].stop_status_monitoring()
        del payment_instances[job_id]
    
    # Still stop monitoring to prevent repeated failures
    if job_id in payment_instances:
        payment_instances[job_id].stop_status_monitoring()
        del payment_instances[job_id]

# ─────────────────────────────────────────────────────────────────────────────
# 3) Check Job and Payment Status (MIP-003: /status)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/status")
async def get_status(job_id: str):
    """ Retrieves the current status of a specific job """
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]

    # Check latest payment status if payment instance exists
    if job_id in payment_instances:
        status = await payment_instances[job_id].check_payment_status()
        job["payment_status"] = status.get("data", {}).get("status")

    return {
        "job_id": job_id,
        "status": job["status"],
        "payment_status": job["payment_status"],
        "result": job.get("result")
    }

# ─────────────────────────────────────────────────────────────────────────────
# 4) Check Server Availability (MIP-003: /availability)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/availability")
async def check_availability():
    """ Checks if the server is operational """
    return {
        "status": "available",
        "message": "The server is running smoothly."
    }

# ─────────────────────────────────────────────────────────────────────────────
# 5) Retrieve Input Schema (MIP-003: /input_schema)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/input_schema")
async def input_schema():
    """
    Returns the expected input schema for the /start_job endpoint.
    Fulfills MIP-003 /input_schema endpoint.
    """
    # Example response defining the accepted key-value pairs
    schema_example = {
        "input_data": [
            {"key": "text", "value": "string"}
        ]
    }
    return schema_example

# ─────────────────────────────────────────────────────────────────────────────
# Main Logic if Called as a Script
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("Running CrewAI as standalone script is not supported when using payments.")
    print("Start the API using `python main.py api` instead.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        print("Starting FastAPI server with Masumi integration...")
        uvicorn.run(app, host="0.0.0.0", port=8000)
    else:
        main()
```

***

### **3. Running the API**

Start the FastAPI server with Masumi payment integration:

```bash
python main.py api
```

✅ The API will be available at:

```
http://localhost:8000/docs
```

***

### **4. Testing the API**

#### **1️⃣ Start a Paid AI Task (`POST /start_job`)**

**Request**

```json
{
  "input_data": "Research about AI governance models"
}
```

**Response (Example)**

```json
{
  "job_id": "1234-5678-uuid",
  "payment_id": "abcd-efgh-5678",
  "status": "awaiting_payment"
}
```

🔹 **The job is now waiting for payment.**

***

#### **2️⃣ Check Job and Payment Status (`GET /status?job_id=<job_id>`)**

**While Payment is Pending**

```json
{
  "job_id": "1234-5678-uuid",
  "status": "awaiting_payment",
  "payment_status": "pending",
  "result": null
}
```

**After Payment is Confirmed**

```json
{
  "job_id": "1234-5678-uuid",
  "status": "completed",
  "payment_status": "completed",
  "result": "AI-generated summary of research..."
}
```

***

### **5. Summary**&#x20;

✅ AI jobs now require a payment before execution\
✅ Masumi Payment Service is integrated with CrewAI\
✅ Users can check both job and payment status\
✅ AI tasks only run once the payment is confirmed

🚀 **Your CrewAI service is now fully integrated with Masumi Payments!**

***
