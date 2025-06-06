# Step 2: Exposing Your Crew via API

Now that we have a working CrewAI service, the next step is to **expose it via an API** so external users can interact with it. We'll use **FastAPI**, a lightweight and high-performance web framework for Python.

This API allows users to:\
&#xNAN;**- Start a new AI task and create a payment request**\
**- Check the job and payment status**

### 1. Look around the example API

Now, if you have modified `main.py` in the previous steps, return it to the initial state.&#x20;

Note how API is configured in `main.py`&#x20;

In order to work with Masumi, API must follow [MIP-003](https://github.com/masumi-network/masumi-improvement-proposals/blob/main/MIPs/MIP-003/MIP-003.md) (the Masumi Protocol Standard) and include all the endpoints required by the standard.&#x20;

Since we only have an example agent and the actual business logic may differ, you will see **placeholder** logic in some endpoints (e.g., generating `payment_id`, handling partial states, and `provide_input`)

{% hint style="danger" %}
### Temporary job storage - not for production!

For simplicity, we store jobs in a Python dictionary (`jobs = {}`).&#x20;

This has serious limitations - **jobs will be lost if the server restarts.**



**Do not use this in production!**



In a production environment, you should:

1. Store jobs in a database (e.g., PostgreSQL, MongoDB, Redis).
2. Possibly integrate a message queue system (e.g., RabbitMQ, Celery, Kafka) for background job processing.
{% endhint %}

### 3. Running the API

Run the FastAPI server:

```bash
python main.py api
```

The API Swagger will be available at:

```
http://localhost:8000/docs
```

This automatically provides interactive documentation for all endpoints.

### 4. Testing the MIP-003 Endpoints

Copy & paste the following cURL commands to your Terminal to test each endpoint.

#### **Retrieving the Input Schema (`GET /input_schema`)**

cURL:

```json
curl -X curl -X GET "http://localhost:8000/input_schema"
```

Example Response:

```json
{
"input_data":[
    {
        "id":"text",
        "type":"string",
        "name":"Task Description",
        "data":{
            "description":"The text input for the AI task",
            "placeholder":"Enter your task description here"
        }
    }
]
}      
```

#### **Checking Server Availability (`GET /availability`)**

cURL:

```json
curl -X GET "http://localhost:8000/availability"
```

Example Response:

<pre class="language-json"><code class="lang-json">{
<strong>    "status":"available",
</strong><strong>    "type":"masumi-agent",
</strong>    "message":"Server operational."
}
</code></pre>

#### **Starting a Job (`POST /start_job`)**

{% hint style="info" %}
This will fail if the Masumi payment service not yet running (We will configure it in [Step 3](step-2-exposing-your-crew-via-api.md#step-3-installing-the-masumi-payment-service))
{% endhint %}

cURL:

```json
curl -X POST "http://localhost:8000/start_job" \
-H "Content-Type: application/json" \
-d '{
        "identifier_from_purchaser": "example_purchaser_123", 
        "input_data": {"text": "coffee beans"}
        }'
```

Example Response:

```json
{
  "status": "success",
  "job_id": "e4a1f88c-769a-4e8d-b298-3b64345afa3b",
  "payment_id": "abcd-efgh-5678"
}
```

#### **Checking Job Status (`GET /status?job_id=<job_id>`)**

cURL:

```json
curl -X GET "http://localhost:8000/status?job_id=<job_id>"
```

Example Response (Pending or Completed):

```json
{
  "job_id": "e4a1f88c-769a-4e8d-b298-3b64345afa3b",
  "status": "completed",
  "result": "Processed input data: {'text': 'Research about AI governance models', 'option': 'summary'}"
}
```

Response If the job ID doesn’t exist:

```json
{
  "error": "Job not found"
}
```

#### **Providing Additional Input (`POST /provide_input`)**

cURL:

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

Example Response:

```json
{
  "status": "success"
}
```

***

#### 6. Summary

✅ You**r CrewAI service now implements the MIP-003 Standard** for Agentic Services.

✅**All crucial endpoints** (`/start_job`, `/status`, `/provide_input`, `/availability`, `/input_schema`) are exposed.

✅**Jobs are tracked in memory** for this tutorial—**not recommended** for production. In a **real production** environment, consider using a reliable **database** and/or a **queue** system.

***
