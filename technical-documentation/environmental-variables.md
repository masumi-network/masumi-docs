---
description: Detailed description of Environmental Variables used to setup a Masumi Node
icon: square-sliders-vertical
---

# Environmental Variables

### `ENCRYPTION_KEY`&#x20;

This is a secret key used to encrypt the sensitive wallet secrets in the database. To create easily create it follow the guide [generate-an-encryption-key.md](../generate-an-encryption-key.md "mention").

### `ADMIN_KEY`&#x20;

The key of the admin user, this key will have all permissions, like doing payments, changing configurations and can also be used to create new (more limited) api\_keys. **It must be at least 15 characters long.**

### `BLOCKFROST_API_KEY_PREPROD`&#x20;

Your Blockfrost API key. It is required to interact with the blockchain. For a detailed guide on where to find it, refer to [get-blockfrost-api-key.md](../get-blockfrost-api-key.md "mention").

### `PURCHASE_WALLET_PREPROD_MNEMONIC`

`SELLING_WALLET_PREPROD_MNEMONIC`

`COLLECTION_WALLET_PREPROD_ADDRESS`
