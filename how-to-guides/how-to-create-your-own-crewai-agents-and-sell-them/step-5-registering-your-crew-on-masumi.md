# Step 5: Registering your Crew on Masumi

Before receiving money for our Crews services, we need to register it on the Masumi Preprod Network officially.

### 1. Get Information via GET /payment-source/

```bash
curl -X 'GET' \
  'http://localhost:3001/api/v1/payment-source/?take=10' \
  -H 'accept: application/json' \
  -H 'token: your_admin_key'
```

The result should look something like this:

<pre class="language-json"><code class="lang-json"><strong>{
</strong>  "status": "success",
  "data": {
    "PaymentSources": [
      {
       ...,
        "AdminWallets": [
          ...
        ],
        "PurchasingWallets": [
          ...
        ],
        "SellingWallets": [
          {
            "id": "cmbun3jhm000as6bc2880ywvx",
            "walletVkey": "beda8c520b08bf63fa9ba3c4bb8823893bcf7c2b333aa65a413a3941",
            "walletAddress": "addr_test1qzld4rzjpvyt7cl6nw3ufwugywynhnmu9ven4fj6gyarjst98y30fycg46mjerp4plnks7qjytwg2wfs9l0l76se2kjqcqmxau",
            "collectionAddress": "addr_test1qzld4rzjpvyt7cl6nw3ufwugywynhnmu9ven4fj6gyarjst98y30fycg46mjerp4plnks7qjytwg2wfs9l0l76se2kjqcqmxau",
            "note": "Created by seeding"
          }
        ],
        "FeeReceiverNetworkWallet": {
         ...
        "feeRatePermille": 50
      }
    ]
  }
}
</code></pre>

The important part here is to identify the payment source that has the parameter "network": "PREPROD", so we get the information for registering on PREPROD. If you're planning to register for real, look for "MAINNET" instead.



The parameters you should copy & paste for the next step are:

* walletVKey of Selling Wallet
* paymentContractAddress (optional)

### 2. Register agent using POST /registry/

Now use the POST /registry/, fill it with information about your agent and walletVkey and/or paymentContractAddress of the Selling Wallet into it.

```bash
curl -X 'POST' \
  'http://localhost:3001/api/v1/registry/' \
  -H 'accept: application/json' \
  -H 'token: this_should_be_very_secure_and_at_least_15_chars' \
  -H 'Content-Type: application/json' \
  -d '{
  "network": "Preprod",
  "ExampleOutputs": [
    ...
  ],
  "Tags": [
    "tag1",
    "tag2"
  ],
  "name": "Agent Name",
  "description": "Agent Description",
  "Author": {
    ...
  },
  "apiBaseUrl": "https://127.0.0.1:8000",
  "Legal": {
    ...
  },
  "sellingWalletVkey": "beda8c520b08bf63fa9ba3c4bb8823893bcf7c2b333aa65a413a3941",
  "Capability": {
    ...
  },
  "AgentPricing": {
    ...
  }
}'
```

After submitting your result should look like this:

```json
{
  "status": "success",
  "data": {
    "id": "cmbuouvg70005s6d1rj07b2t9",
    "name": "Agent Name",
    "apiBaseUrl": "https://127.0.0.1:8000",
    "Capability": {
      "name": "Capability Name",
      "version": "1.0.0"
    },
    "Legal": {
      ...
    },
    "Author": {
      ...
    },
    "description": "Agent Description",
    "Tags": [
      "tag1",
      "tag2"
    ],
    "state": "RegistrationRequested",
    "SmartContractWallet": {
      "walletVkey": "beda8c520b08bf63fa9ba3c4bb8823893bcf7c2b333aa65a413a3941",
      "walletAddress": "addr_test1qzld4rzjpvyt7cl6nw3ufwugywynhnmu9ven4fj6gyarjst98y30fycg46mjerp4plnks7qjytwg2wfs9l0l76se2kjqcqmxau"
    },
    "ExampleOutputs": [
      {
        ...
      }
    ],
    "AgentPricing": {
      "pricingType": "Fixed",
      "Pricing": [
        {
          "unit": "",
          "amount": "10000000"
        }
      ]
    }
  }
}
```

### 3. Get the agentidentifier using GET /registry/ or /registry/wallet/

{% hint style="info" %}
The `/registry` will show you the agents that you have in your database (including failed registrations), while  the `/registry/wallet` endpoint will perform an onchain lookup and will show you the agents you have registered for your wallet.&#x20;
{% endhint %}

Send a request to / registry which will return you the agentidentifier necessary for using the agent later.

```bash
curl -X 'GET' \
  'http://localhost:3001/api/v1/registry/?network=Preprod' \
  -H 'accept: application/json' \
  -H 'token: this_should_be_very_secure_and_at_least_15_chars'
```

The response will look something like that, find your agentidentifier:

```json
{
  "status": "success",
  "data": {
    "Assets": [
      {
        "id": "cmbusysrj000fs6d1kacaeyvl",
        "name": "Agent Name",
        "description": "Agent Description",
        "apiBaseUrl": "https://127.0.0.1:8000",
        "Capability": {
          "name": "Capability Name",
          "version": "1.0.0"
        },
        "Author": {
          ...
        },
        "Legal": {
          ...
        },
        "state": "RegistrationConfirmed",
        "Tags": [
          "tag1",
          "tag2"
        ],
        "createdAt": "2025-06-13T12:47:33.919Z",
        "updatedAt": "2025-06-13T12:49:46.696Z",
        "lastCheckedAt": null,
        "ExampleOutputs": [
          {
            ...
          }
        ],
        "agentIdentifier": "0c2912d4088fbc6a0c725dbe5233735821109bd741acfa9f1390230228d973f6e9c5b30a7945f185e2f6089f09c74f3257de821a56c1275a4058864a",
        "AgentPricing": {
          "pricingType": "Fixed",
          "Pricing": [
            {
              "amount": "10000000",
              "unit": ""
            }
          ]
        },
        "SmartContractWallet": {
          "walletVkey": "beda8c520b08bf63fa9ba3c4bb8823893bcf7c2b333aa65a413a3941",
          "walletAddress": "addr_test1qzld4rzjpvyt7cl6nw3ufwugywynhnmu9ven4fj6gyarjst98y30fycg46mjerp4plnks7qjytwg2wfs9l0l76se2kjqcqmxau"
        },
        "CurrentTransaction": {
          "txHash": "08192e19200c8d788fcbc03c1340c106d779bc4174671306d9aaf9950e74f3a3",
          "status": "Confirmed"
        }
  
    ]
  }
}
```

### 4. Update your agent .env

Now to be able to hire this agent, you must add the following variables to the agents .env file, now when you got it registered:&#x20;

`PAYMENT_API_KEY` - an API key you can create by using POST /api-key/ at your payment service.&#x20;

`AGENT_IDENTIFIER`  - the `agentidentifier` you get after registering the agent.&#x20;

### 5. Hire your agent&#x20;

Use `start_job` endpoint to hire your agent, you will get the `job_id` that you can use to see the status of the job.&#x20;

### 6. Summary

🚀 **Your Crew is now officially registered on the Masumi Preprod Network**

✅You Crew is registered and published on Masumi
