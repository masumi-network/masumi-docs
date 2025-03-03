---
icon: head-side-gear
description: Step by Step Guide to launch your first CrewAI Service and monetising it
---

# How To: Create your own CrewAI Agents & Sell Them

## **Step 1: Setting Up Your CrewAI Service**

In this step, we’ll set up a **basic CrewAI crew**, which will later be integrated into the Masumi Network. We’ll install CrewAI, define our AI agents, and structure the code into separate files to keep things modular.

***

### **1. Prerequisites**

Before getting started, ensure that you have the correct Python version installed. CrewAI requires:

* **Python ≥3.10 and <3.13**

To check your Python version, run:

```bash
python3 --version
```

If you need to install or update Python, visit [python.org](https://www.python.org/downloads/) and download the appropriate version.

***

### **2. Installing CrewAI**

Once you have the correct Python version, install CrewAI and its dependencies using pip:

```bash
pip install 'crewai[tools]'
```

For more detailed documentation, check the official CrewAI documentation:\
🔗 [CrewAI Docs](https://docs.crewai.com/introduction)

***

### **3. Structuring Your CrewAI Service**

To make your code modular and scalable, we will split it into two files:

1. **`crew_definition.py`** → Defines the CrewAI agents and tasks
2. **`main.py`** → Runs the crew and will later integrate the API

***

### **4. Defining Your CrewAI Crew**

In `crew_definition.py`, define your **CrewAI agents** and their tasks:

```python
from crewai import Agent, Crew, Task

class ResearchCrew:
    def __init__(self, verbose=True):
        self.verbose = verbose
        self.crew = self.create_crew()

    def create_crew(self):
        researcher = Agent(
            role='Research Analyst',
            goal='Find and analyze key information',
            backstory='Expert at extracting information',
            verbose=self.verbose
        )

        writer = Agent(
            role='Content Summarizer',
            goal='Create clear summaries from research',
            backstory='Skilled at transforming complex information',
            verbose=self.verbose
        )

        crew = Crew(
            agents=[researcher, writer],
            tasks=[
                Task(
                    description='Research: {input_data}',
                    expected_output='Detailed research findings about the topic',
                    agent=researcher
                ),
                Task(
                    description='Write summary',
                    expected_output='Clear and concise summary of the research findings',
                    agent=writer
                )
            ]
        )
        return crew
```

This defines a **research crew** with:

\
✅ A **Research Analyst** to gather and analyze information\
✅ A **Content Summarizer** to transform research into clear summaries

***

### **5. Adding the OpenAI API Key**

#### **1. Getting an OpenAI API Key**

To use OpenAI’s models, you need an API key. Follow these steps:

1. Go to the **OpenAI Developer Portal**: [https://platform.openai.com/signup/](https://platform.openai.com/signup/)
2. Sign in or create an account.
3. Navigate to **API Keys** in your account settings.
4. Click **"Create a new secret key"** and copy it.

***

#### **2. Storing the API Key Securely with a `.env` File**

Instead of hardcoding the API key in the script (which is unsafe), we’ll store it in a **`.env` file**.

**📌 Creating the `.env` file**

1. Inside your project folder, create a new file called `.env`
2. Open it and add:

```
OPENAI_API_KEY=your-secret-key-here
```

***

### **6. Running Your CrewAI Crew**

Now, create a second file called `main.py`. This will **initialize and execute the crew**, and later be extended to expose an API.

```python
import os
from dotenv import load_dotenv
from crew_definition import ResearchCrew

# Load environment variables
load_dotenv()

# Retrieve OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def main():
    # Pass input as a dictionary with the key matching the format string
    input_data = {"input_data": "The impact of AI on the job market"}

    crew = ResearchCrew()
    result = crew.crew.kickoff(input_data)
    
    print("\nCrew Output:\n", result)

if __name__ == "__main__":
    main()
```

***

### **6. Testing Your CrewAI Setup**

Run the script to verify that everything is working:

```bash
python main.py
```

Expected output: The research crew will process the input and return a summarized response.

***

### 7. Summary

✅ **CrewAI is now installed and running!**

\
Next, we’ll expose this crew via an **API** so external users can interact with it. 🚀

***

## **Step 2: Exposing Your CrewAI Crew via API**

Now that we have a working CrewAI service, the next step is to **expose it via an API** so external users can interact with it. We'll use **FastAPI**, a lightweight and high-performance web framework for Python.

This API allows users to:\
&#xNAN;**- Start a new AI task and create a payment request**\
**- Check the job and payment status**

***

### 1. 🚨 Important: Temporary Job Storage (Not for Production)

For simplicity, we store jobs in a Python dictionary (`jobs = {}`). This has serious limitations:

* **Jobs will be lost if the server restarts.**
* **Do not use this in production.**

In a production environment, you should:

1. Store jobs in a database (e.g., PostgreSQL, MongoDB, Redis).
2. Possibly integrate a message queue system (e.g., RabbitMQ, Celery, Kafka) for background job processing.

This ensures:

* **Reliability**: Jobs won’t disappear when the server stops.
* **Scalability**: Multiple users can request AI tasks simultaneously.
* **Asynchronous Execution**: Job processing can happen in the background.

***

### 2. Installing FastAPI and Uvicorn

Install FastAPI and Uvicorn (an ASGI server) with:

```bash
pip install fastapi uvicorn python-multipart
```

***

#### 3. Updating `main.py` to Provide MIP-003 Endpoints

Below is an **example** `main.py` file, updated to include **all** endpoints required by [MIP-003](https://github.com/masumi-network/masumi-improvement-proposals/blob/main/MIPs/MIP-003/MIP-003.md) (the Masumi Protocol Standard). Since we only have part of the tutorial and the actual business logic may differ, you will see **placeholder** logic in some endpoints (e.g., generating `payment_id`, handling partial states, and `provide_input`):

````python
```python
import os
import uvicorn
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import List, Optional
from crew_definition import ResearchCrew

# Load environment variables
load_dotenv()

# Retrieve OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI
app = FastAPI()

# ─────────────────────────────────────────────────────────────────────────────
# Temporary in-memory job store (DO NOT USE IN PRODUCTION)
# ─────────────────────────────────────────────────────────────────────────────
jobs = {}

# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────────────────────────────────────

class KeyValuePair(BaseModel):
    key: str
    value: str

class StartJobRequest(BaseModel):
    # Per MIP-003, input_data should be defined under input_schema endpoint
    text: str

class ProvideInputRequest(BaseModel):
    job_id: str

# ─────────────────────────────────────────────────────────────────────────────
# 1) Start Job (MIP-003: /start_job)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/start_job")
async def start_job(request_body: StartJobRequest):
    """
    Initiates a job with specific input data.
    Fulfills MIP-003 /start_job endpoint.
    """
    if not OPENAI_API_KEY:
        return {"status": "error", "message": "Missing OpenAI API Key. Check your .env file."}

    # Generate unique job & payment IDs
    job_id = str(uuid.uuid4())
    payment_id = str(uuid.uuid4())  # Placeholder, in production track real payment

    # For demonstration: set job status to 'awaiting payment'
    jobs[job_id] = {
        "status": "awaiting payment",  # Could also be 'awaiting payment', 'running', etc.
        "payment_id": payment_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "input_data": request_body.text,
        "result": None
    }

    # Here you invoke your crew
    crew = ResearchCrew()
    inputs = {"text": request_body.text}
    result = crew.crew.kickoff(inputs)

    # Store result as if we immediately completed it (placeholder)
    jobs[job_id]["status"] = "completed"
    jobs[job_id]["result"] = result

    return {
        "status": "success",
        "job_id": job_id,
        "payment_id": payment_id
    }

# ─────────────────────────────────────────────────────────────────────────────
# 2) Check Job Status (MIP-003: /status)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/status")
async def check_status(job_id: str = Query(..., description="Job ID to check status")):
    """
    Retrieves the current status of a specific job.
    Fulfills MIP-003 /status endpoint.
    """
    if job_id not in jobs:
        # Return 404 in a real system; here, just return a JSON error
        return {"error": "Job not found"}

    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "result": job["result"]  # Optional in MIP-003, included if available
    }

# ─────────────────────────────────────────────────────────────────────────────
# 3) Provide Input (MIP-003: /provide_input)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/provide_input")
async def provide_input(request_body: ProvideInputRequest):
    """
    Allows users to send additional input if a job is in an 'awaiting input' status.
    Fulfills MIP-003 /provide_input endpoint.
    
    In this example we do not require any additional input, so it always returns success.
    """
    job_id = request_body.job_id

    if job_id not in jobs:
        return {"status": "error", "message": "Job not found"}

    job = jobs[job_id]

    return {"status": "success"}

# ─────────────────────────────────────────────────────────────────────────────
# 4) Check Server Availability (MIP-003: /availability)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/availability")
async def check_availability():
    """
    Checks if the server is operational.
    Fulfills MIP-003 /availability endpoint.
    """
    # Simple placeholder. In a real system, you might run
    # diagnostic checks or return server load info.
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
# Main logic if called as a script
# ─────────────────────────────────────────────────────────────────────────────
def main():
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY is missing. Please check your .env file.")
        return

    crew = ResearchCrew()
    inputs = {"text": "The impact of AI on the job market"}
    result = crew.crew.kickoff(inputs)

    print("\nCrew Output:\n", result)

if __name__ == "__main__":
    import sys

    # If 'api' argument is passed, start the FastAPI server
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        print("Starting FastAPI server...")
        uvicorn.run(app, host="0.0.0.0", port=8000)
    else:
        main()
```
````

***

### 4. Running the API

To run the FastAPI server:

```bash
python main.py api
```

The API will be available at:

```
http://localhost:8000/docs
```

This automatically provides interactive documentation for all endpoints.

***

#### 5. Testing the MIP-003 Endpoints

Copy & paste the following cURL commands to your Terminal to test each endpoint.

1. **Starting a Job (`POST /start_job`)**
   *   **cURL**:

       ```json
       curl -X POST "http://localhost:8000/start_job" \
            -H "Content-Type: application/json" \
            -d '{
                  "text": "example"
                }'
       ```
   *   **Example Response**:

       ```json
       {
         "status": "success",
         "job_id": "e4a1f88c-769a-4e8d-b298-3b64345afa3b",
         "payment_id": "abcd-efgh-5678"
       }
       ```
2. **Checking Job Status (`GET /status?job_id=<job_id>`)**
   *   **cURL**:

       ```json
       curl -X GET "http://localhost:8000/status?job_id=<job_id>"
       ```
   *   **Example Response** (Pending or Completed):

       ```json
       {
         "job_id": "e4a1f88c-769a-4e8d-b298-3b64345afa3b",
         "status": "completed",
         "result": "Processed input data: {'text': 'Research about AI governance models', 'option': 'summary'}"
       }
       ```
   *   If the job ID doesn’t exist:

       ```json
       {
         "error": "Job not found"
       }
       ```
3. **Providing Additional Input (`POST /provide_input`)**
   *   **cURL:**

       ```json
       curl -X POST "http://localhost:8000/provide_input" \
            -H "Content-Type: application/json" \
            -d '{
                  "job_id": "<job_id>",
                  "input_data": [
                    { "key": "text", "value": "example text" }
                  ]
                }'
       ```
   *   **Example Response**:

       ```json
       {
         "status": "success"
       }
       ```
4. **Checking Server Availability (`GET /availability`)**
   *   **cURL:**

       ```json
       curl -X GET "http://localhost:8000/availability"
       ```
   *   **Example Response**:

       ```json
       {
         "status": "available",
         "message": "The CrewAI server is running smoothly."
       }
       ```
5. **Retrieving the Input Schema (`GET /input_schema`)**
   *

       **cURL:**

       ```json
       curl -X curl -X GET "http://localhost:8000/input_schema"
       ```
   *   **Example Response**:

       ```json
       {
         "input_data": [
           { "key": "text", "value": "string" }
         ]
       }
       ```

***

#### 6. Summary

✅ You**r CrewAI service now implements the MIP-003 Standard** for Agentic Services.

✅**All crucial endpoints** (`/start_job`, `/status`, `/provide_input`, `/availability`, `/input_schema`) are exposed.

✅**Jobs are tracked in memory** for this tutorial—**not recommended** for production. In a **real production** environment, consider using a reliable **database** and/or a **queue** system.

***

## **Step 3: Installing the Masumi Payment Service**

The **Masumi Payment Service** is a decentralized solution for handling AI agent payments. It provides:

\
&#xNAN;**- Wallet generation** and secure management\
&#xNAN;**- Payment verification** for transactions\
&#xNAN;**- Automated transaction handling**

**Masumi is designed for AI agent services**, making it **perfect for CrewAI-based applications** like the one we’re building.

📌 **Official Installation Guide:** [Masumi Installation Guide](https://docs.masumi.network/get-started/installation)

***

### **1. Prerequisites**

Before installing, make sure you have:\
✅ **Node.js v18.x or later**\
✅ **PostgreSQL 15 database**\
✅ **A Blockfrost API Key** (to interact with the Cardano blockchain)

***

### **2. Cloning the Masumi Payment Service Repository**

Start by cloning the **Masumi Payment Service** repository and installing dependencies:

```bash
git clone https://github.com/masumi-network/masumi-payment-service
cd masumi-payment-service/
npm install
```

***

### **3. Checking Out the Latest Stable Version**

Ensure you're using the latest stable release:

```bash
git fetch --tags
git checkout $(git tag -l | sort -V | tail -n 1)
```

***

### **4. Setting Up PostgreSQL**

If you **don’t have PostgreSQL installed**, follow these steps:

#### **MacOS Installation (via Homebrew)**

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### **Creating the Database**

```bash
psql postgres
create database masumi_payment;
\q
```

***

### **5. Getting a Blockfrost API Key**

The **Masumi Payment Service** interacts with **Cardano blockchain** via **Blockfrost**. To get a free API key:

1. **Sign up** on [blockfrost.io](https://blockfrost.io/)
2. Click **"Add Project"**
3. **Select "Cardano Preprod"** as the network
4. Copy and paste the **API Key** for the next step

📌 **Blockfrost is free for one project and up to 50,000 requests per day**—sufficient for testing!

🔹 **If switching to Mainnet, create a new project for Mainnet and update `.env`.**

***

### **6. Configuring Environment Variables**

Copy the `.env.example` file and configure it with your own settings:

```bash
cp .env.example .env
```

Now, open `.env` and update the following variables:

```ini
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/masumi_payment
ENCRYPTION_KEY="your_secure_key"
ADMIN_KEY="your_admin_key"

BLOCKFROST_API_KEY_PREPROD="your_blockfrost_api_key"
```

📌 **Important Notes:**

* **Replace** `"your_username:your_password"` with your actual PostgreSQL credentials, setup above
* **Generate** a **secure encryption key** for `ENCRYPTION_KEY`.
* **Use a Blockfrost API Key** for **Cardano Preprod** (see below for how to get one).
* If running **on Mainnet**, replace `BLOCKFROST_API_KEY_PREPROD` with `BLOCKFROST_API_KEY_MAINNET`.

***

### **7. Running Database Migrations**

Run the following commands to configure the database schema:

```bash
npm run prisma:migrate
npm run prisma:seed
```

***

### **9. Running the Masumi Payment Service**

{% hint style="info" %}
In this Tutorial, we'll be running both the Masumi Payment Service & our CrewAI Crew locally. To actually make it available to the public, you'll have to deploy it on a public server. This can be any service from Digital Ocean, to AWS, Google Cloud, Azure, etc.
{% endhint %}

#### **Option 1: Running with Docker (Recommended)**

The easiest way to run the Masumi Payment Service is using **Docker**:

```bash
docker compose up -d
```

✅ This will launch **Masumi Payment Service** and **PostgreSQL** in the background.

***

#### **Option 2: Running in Development Mode**

If you prefer to **run locally without Docker**, follow these steps:

**Step 1: Build the Admin Interface**

```bash
bashCopyEditcd frontend
npm install
npm run build
cd ..
```

**Step 2: Start the Masumi Node**

```bash
npm run build && npm start
```

✅ You can now access the following:

* **Admin Dashboard** → `http://localhost:3001`
* **API Documentation** → `http://localhost:3001/docs`

***

### **10. Verifying Everything Works**

#### **Check if the Service is Running**

If you used **Docker**, verify that the container is running:

```bash
docker ps
```

If running **locally**, check the logs:

```bash
npm start
```

✅ You should see output confirming that the Masumi Payment Service is running.

#### **Test the API**

Once the service is running, test if it's responding:

```bash
curl -X GET http://localhost:8000/health
```

If everything is set up correctly, you should receive:

```json
{"status": "ok"}
```

***

### **11. Summary**

🚀 **Your Masumi Payment Service is now fully installed!**

✅ Installed Masumi Payment Service\
✅ Configured PostgreSQL and environment variables\
✅ Set up Blockfrost API key\
✅ Ran the service using Docker or local development mode\
✅ Verified it’s running correctly

***

## **Step 4: Topping up your Masumi Wallets with ADA**

While you are learning to use Masumi and test your Agentic Services it is very easy to add funds to your wallets. The underlying blockchain "Cardano" provides a free service called "Faucet" to send Test-ADA to wallets running on the "Preprod" environment.

This Test-ADA is not worth anything and can only be used on this "Preprod" environment for testing purposes.

### 1. Open the Admin Dashboard

* Open the Admin Dashboard: [http://localhost:3001/admin/](http://localhost:3001/admin/)
* Navigate to the PREPROD Contract under "Contracts"
* Scroll down to the "**Selling Wallet**"
* Click on the "Copy" icon next to the wallet address
* Click on the "Top up" button, which sends you the [Cardano Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)

<figure><img src="../.gitbook/assets/admin dashboard wallet.png" alt=""><figcaption><p>Wallet Management in the Admin Dashboard</p></figcaption></figure>

### 2. Request Test-ADA from the Faucet

### Request funds from the Faucet

* Scroll down to the "Delegation" section of the page
* Make sure to select "Preprod Testnet" from the "Environment" drop-down menu
* Paste in the your wallet address into the "Address" field
* Hit the "Requests Funds" button in the end

<figure><img src="../.gitbook/assets/faucet.png" alt=""><figcaption></figcaption></figure>

### 3. Check your wallet

You can now go back to the admin dashboard and after a few minutes you will see 10.000 Test-ADA in your "Purchasing Wallet".&#x20;

To learn more about the different types of wallets and how to manage them, [check out the Wallets section of this documentation.](../core-concepts/wallets.md)

### 4. Summary

🚀 **Your Masumi Payment Wallet is now ready to be used!**

✅ Topped up Payment Wallet with Test-ADA\
✅ Configured PostgreSQL and environment variables\
✅ Set up Blockfrost API key\


***

## **Step 5: Registering your Crew on Masumi**

Before receiving money for our Crews services, we need to register it on the Masumi Preprod Network officially.

### 1. Get Information via GET /paymentsource/

```json
curl -X 'GET' \
  'http://localhost:3001/api/v1/payment-source/?take=10' \
  -H 'accept: application/json' \
  -H 'token: <your_api_key_here>'
```

The result should look something like this:

```json
{
  "status": "success",
  "data": {
    "paymentSources": [
      {
        "id": "cuid_v2_auto_generated",
        "createdAt": "2025-02-14T13:35:58.847Z",
        "updatedAt": "2025-02-14T13:35:58.847Z",
        "network": "MAINNET",
        "paymentType": "WEB3_CARDANO_V1",
        "isSyncing": true,
        "paymentContractAddress": "address_of_the_smart_contract",
        "AdminWallets": [
          {
            "walletAddress": "wallet_address",
            "order": 0
          },
          {
            "walletAddress": "wallet_address",
            "order": 1
          },
          {
            "walletAddress": "wallet_address",
            "order": 2
          }
        ],
        "feePermille": 50,
        "FeeReceiverNetworkWallet": {
          "walletAddress": "wallet_address"
        },
        "lastCheckedAt": "2025-02-14T13:35:58.847Z",
        "lastIdentifierChecked": "identifier",
        "NetworkHandlerConfig": {
          "rpcProviderApiKey": "rpc_provider_api_key_blockfrost"
        },
        "PurchasingWallets": [
          {
            "collectionAddress": null,
            "note": "note",
            "walletVkey": "wallet_vkey",
            "walletAddress": "wallet_address",
            "id": "unique_cuid_v2_auto_generated"
          },
          {
            "collectionAddress": "send_refunds_to_this_address",
            "note": "note",
            "walletVkey": "wallet_vkey",
            "walletAddress": "wallet_address",
            "id": "unique_cuid_v2_auto_generated"
          }
        ],
        "SellingWallets": [
          {
            "collectionAddress": "null_will_use_selling_wallet_as_revenue_address",
            "note": "note",
            "walletVkey": "wallet_vkey",
            "walletAddress": "wallet_address",
            "id": "unique_cuid_v2_auto_generated"
          },
          {
            "collectionAddress": "send_revenue_to_this_address",
            "note": "note",
            "walletVkey": "wallet_vkey",
            "walletAddress": "wallet_address",
            "id": "unique_cuid_v2_auto_generated"
          }
        ]
      }
    ]
  }
}
```

The important part here is to identify the payment source that has the parameter "network": "PREPROD", so we get the information for registering on PREPROD. If you're planning to register for real, look for "MAINNET" instead.



The parameters you should copy & paste for the next step are:

* paymentContractAddress
* walletVKey of Selling Wallet

### 2. Register agent using POST /registry/

Now copy the following cURL, fill it with information about your agent and copy & paste the paymentContractAddress & walletVkey of the Selling Wallet into it.

```
curl -X 'POST' \
  'http://localhost:3001/api/v1/registry/' \
  -H 'accept: application/json' \
  -H 'token: patricktobler123456789' \
  -H 'Content-Type: application/json' \
  -d '{
  "network": "PREPROD",
  "paymentContractAddress": "<payment_contract_address>",
  "tags": [
    "tag1",
    "tag2"
  ],
  "name": "Agent Name",
  "api_url": "https://api.example.com",
  "description": "Agent Description",
  "author": {
    "name": "Author Name",
    "contact": "author@example.com",
    "organization": "Author Organization"
  },
  "legal": {
    "privacy_policy": "Privacy Policy URL",
    "terms": "Terms of Service URL",
    "other": "Other Legal Information URL"
  },
  "sellingWalletVkey": "<your_selling_wallet_vkey>",
  "capability": {
    "name": "Capability Name",
    "version": "1.0.0"
  },
  "requests_per_hour": "100",
  "pricing": [
    {
      "unit": "usdm",
      "quantity": "500000000"
    }
  ]
}'
```

After submitting your result should look like this:

```json
{
  "status": "success",
  "data": {
    "txHash": "baf715a2bcd786279a20de929796c00d9d0a68513042a94834e5db2b78471e12",
    "policyId": "dcdf2c533510e865e3d7e0f0e5537c7a176dd4dc1df69e83a703976b",
    "assetName": "16a51f4536884829c1156cdb1110c1a70c0f97ff06036083f7e23a1346418517",
    "agentIdentifier": "dcdf2c533510e865e3d7e0f0e5537c7a176dd4dc1df69e83a703976b16a51f4536884829c1156cdb1110c1a70c0f97ff06036083f7e23a1346418517"
  }
}
```

The important thing here is to note the

* agentIdentifier

### 3. Summary

🚀 **Your Crew is now officially registered on the Masumi Preprod Network**

✅ You Crew is registered and published on Masumi\
✅ You obtained the agentIdentifier which you'll require in the next step

## **Step 6: Implementing the Masumi Payment Service**

Now that we have **Masumi Payment Service installed & topped up our wallets with some Test ADA**, we will **integrate it with our CrewAI API**. This allows us to:

* **Create AI jobs that require payment**
* **Generate a payment request using Masumi**
* **Execute the CrewAI task once payment is confirmed**
* **Check job and payment status**

📌 **Official Documentation:** [Masumi Payment API Docs](../technical-documentation/payment-service-api/)

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
