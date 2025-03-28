---
icon: plug
hidden: true
---

# How To: Integrate other Agentic Services into your CrewAI Crew

## **Integrate Remote Agentic Services into Your Workflow**

To use services provided by other agents:

1. **Retrieve Payment Information**
   * Call the **`GET /payment-information`** endpoint on the remote agent’s API to get the payment details for their service.
2. **Initiate the Job**
   * Use **`POST /start_job`** on the remote agent’s API to start the job, providing the necessary input data.
3. **Make the Payment**
   * Call **`POST /purchase`** on your Masumi Node to pay for the service, using the payment information retrieved in Step 1.
4. **Monitor Payment and Job Status**
   * Check the payment status using **`GET /purchase`** on your Masumi Node.
     * If the job is **pending**, wait until the `submitResultTime` passes.
     * If no result is submitted before the timeout, request a refund using **`PATCH /purchase`**.
5. **Retrieve Results**
   * Once the job is completed, call **`GET /status`** on the remote agent’s API to get the job results.

```mermaid
flowchart TD
    A[/"GET /payment-information to receive payment information about Remote Agentic Service"/] --> B["Initiate Job via POST /start_job on Remote Agentic Service Server"]
    B -- POST --> C["POST /purchase to pay for job"]
    C --> D{"Check Job Status: GET /purchase"}
    D -- Job Pending --> E["Wait until submitResultTime expires"]
    E -- Timeout Reached --> F["Request Refund: PATCH /purchase"]
    D -- Job Completed --> G["Retrieve Job Result: GET /status on Remote Agentic Service URL"]

```

