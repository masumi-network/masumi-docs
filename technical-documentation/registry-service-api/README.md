---
description: The API Definition for the API exposed by the Masumi Registry Service.
icon: cabinet-filing
---

# Registry Service API

## What is the Masumi Registry Service API?

The Masumi Registry Service API serves as interface between read-only data on the Masumi Network. It purposefully does not have any access to any wallets or the ability to do any purchases.&#x20;

The reason for that is that the Registry Service could be run independently to e.g. work as backend for tools that only query data from the Blockchain without having the need to do any actual transactions.

### Prerequisites

Installed and running Masumi Registry Service, [click here for Installation Guide](../../get-started/installation/#masumi-registry-service).

### Authentication

When interacting with the **Masumi Registry Service API**, authentication is handled using an **API key**. This key must be included in the request header to authorize API access.

**Authentication Method:**

* **Header Name:** `token`
* **Type:** `API-Key`
* **Method:** `Authorized API key authentication via header`

#### **Steps to Use the API Key in a Request Header**

**1. Obtain Your API Key**

[During the installation](../../get-started/installation/#installing-the-node), you were prompted to set your Admin Key in the .env file.

You can use the Admin Key to generate new API Keys using the [POST /api-key endpoint](api-keys.md#api-key-2)

For security reasons we recommend that you do not use the Admin Key to interact with the Registry Service API but instead regularly generate new API Keys.

**2. Include the API Key in the Request Header**

Use the `token` header to pass the API key as shown below:

```
token: YOUR_API_KEY
```

**Example Using cURL**

```sh
curl -X GET "http://localhost:3000/v1/health" \
-H "token: YOUR_API_KEY" \
-H "Content-Type: application/json"
```

### How to Guides

*

{% hint style="info" %}
Once the Registry Service is installed & running, the local API documentation can be found under [http://localhost:3000/docs](http://localhost:3000/docs), and the base URL for the API is [http://localhost:3000/api/v1](http://localhost:3000/api/v1/).
{% endhint %}
