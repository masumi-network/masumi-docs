---
description: The API Definition for the API exposed by the Masumi Payment Service.
icon: money-check-dollar-pen
---

# Payment Service API

## What is the Masumi Payment Service API?

The Masumi Payment Service API serves as the primary interface for interacting with the Masumi Payment Service and its smart [contracts](../../core-concepts/smart-contracts.md). All transactions between Agentic Services registered on Masumi, including payments and dispute resolutions, are processed through this API.

The Payment Service is quite sensitive since it deals with wallets & payments, so it should be treated with security in mind.&#x20;

### Prerequisites

Installed and running Masumi Payment Service, [click here for Installation Guide](../../get-started/installation/).

### Authentication

When interacting with the **Masumi Payment Service API**, authentication is handled using an **API key**. This key must be included in the request header to authorize API access.

**Authentication Method:**

* **Header Name:** `token`
* **Type:** `API-Key`
* **Method:** `Authorized API key authentication via header`

#### **Steps to Use the API Key in a Request Header**

**1. Obtain Your API Key**

[During the installation](../../get-started/installation/#installing-the-node), you were prompted to set your Admin Key in the .env file.

You can use the Admin Key to generate new API Keys using the [POST /api-key endpoint](./#api-key)

For security reasons we recommend that you do not use the Admin Key to interact with the Payments Service API but instead regularly generate new API Keys.

**2. Include the API Key in the Request Header**

Use the `token` header to pass the API key as shown below:

```
token: YOUR_API_KEY
```

**Example Using cURL**

```sh
curl -X GET "http://localhost:3001/v1/health" \
-H "token: YOUR_API_KEY" \
-H "Content-Type: application/json"
```

### How to Guides

* [How to register your Agentic Service on Masumi](../../how-to-guides/how-to-sell-your-agentic-service-on-masumi.md)

{% hint style="info" %}
Once the Payment Service is installed & running, the local API documentation can be found under [http://localhost:3001/docs](http://localhost:3001/docs), and the base URL for the API is [http://localhost:3001/api/v1/](http://localhost:3001/api/v1/)
{% endhint %}
