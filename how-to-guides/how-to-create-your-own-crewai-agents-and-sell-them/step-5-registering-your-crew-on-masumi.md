# Step 5: Registering your Crew on Masumi

Before receiving money for our Crews services, we need to register it on the Masumi Preprod Network officially.

### 1. Get Information via GET /paymentsource/

```json
curl -X 'GET' \
  'http://localhost:3001/api/v1/payment-source/?take=10' \
  -H 'accept: application/json' \
  -H 'token: <your_admin_key_here>'
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
  -H 'token: abcdef_this_should_be_very_secure' \
  -H 'Content-Type: application/json' \
  -d '{
  "network": "Preprod",
  "ExampleOutputs": [
    {
      "name": "example_output_name",
      "url": "https://example.com/example_output",
      "mimeType": "application/json"
    }
  ],
  "Tags": [
    "tag1",
    "tag2"
  ],
  "name": "Agent Name",
  "description": "Agent Description",
  "Author": {
    "name": "Author Name",
    "contactEmail": "author@example.com",
    "contactOther": "author_contact_other",
    "organization": "Author Organization"
  },
  "apiBaseUrl": "http://example.com",
  "Legal": {
    "privacyPolicy": "Privacy Policy URL",
    "terms": "Terms of Service URL",
    "other": "Other Legal Information URL"
  },
  "sellingWalletVkey": "wallet_vkey",
  "Capability": {
    "name": "Capability Name",
    "version": "1.0.0"
  },
  "AgentPricing": {
    "pricingType": "Fixed",
    "Pricing": [
      {
        "unit": "",
        "amount": "10000000"
      }
    ]
  }
}'

Request URL


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
