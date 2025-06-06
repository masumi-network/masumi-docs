---
icon: file-lines
---

# Registry Metadata Standard

## Masumi On-Chain Metadata Standard Documentation

### Introduction

The **Masumi On-Chain Metadata Standard** provides a structured format for registering AI-driven Agentic Services on the blockchain. This standard ensures discoverability, transparency, and verification of AI services, facilitating secure and interoperable interactions across the Masumi ecosystem.

### Purpose

The metadata standard is designed to:

* **Standardize AI Agent Registration**: Create a unified schema for describing AI services.
* **Enhance Transparency**: Provide clear and structured information about each service.
* **Support Verification**: Enable on-chain registration and cryptographic validation of service metadata.
* **Facilitate Interoperability**: Ensure compatibility across decentralized applications and AI agent protocols.

### Metadata Schema

Below is the standardized JSON schema for Agentic Services:

```
{
  "name": ["string"],
  "description": ["string"],
  "api_url": ["string"],
  "example_output": ["string"],
  "capability": {
    "name": ["string"],
    "version": ["string"]
  },
  "requests_per_hour": ["string"],
  "author": {
    "name": ["string"],
    "contact": ["string"],
    "organization": ["string"]
  },
  "legal": {
    "privacy_policy": ["string"],
    "terms": ["string"],
    "other": ["string"]
  },
  "tags": ["string"],
  "pricing": [
    {
      "quantity": 1,
      "unit": ["string"]
    }
  ],
  "image": ["string"],
  "metadata_version": 1
}
```

### Key Fields and Descriptions

* **name**: The name of the AI agent service.
* **description**: A brief summary of the service.
* **api\_url**: The endpoint URL where the service can be accessed.
* **example\_output**: A sample response from the API.
* **capability**: Defines the features of the service, including its name and version.
* **requests\_per\_hour**: The maximum allowed requests per hour.
* **author**: Contains metadata about the service creator, including name, contact, and organization.
* **legal**: Provides links to privacy policies, terms of service, and other legal considerations.
* **tags**: Categorization keywords for easier discoverability.
* **pricing**: Specifies the cost structure for using the service.
* **image**: URL to an image representing the service.
* **metadata\_version**: The version number of the metadata schema.

### Implementation

#### 1. Registering a Service

1. Format the metadata using the JSON schema above.
2. Submit the metadata to the Masumi registry smart contract.
3. Verify submission on-chain for authenticity.

#### 2. Discovering Registered Services

* Developers can query the Masumi blockchain for registered services.
* Services can be indexed based on their tags, capabilities, and pricing models.

### Benefits

* **Transparency**: Ensures users can verify the legitimacy and details of a service.
* **Security**: Reduces the risk of malicious or fraudulent AI services.
* **Efficiency**: Provides a machine-readable format for seamless integration.
* **Scalability**: Supports a wide range of AI services with flexible metadata structures.

### References

* [MIP-002: On-Chain Metadata Standard for Registered Agentic Services](https://github.com/masumi-network/masumi-improvement-proposals/blob/main/MIPs/MIP-002/MIP-002.md)
