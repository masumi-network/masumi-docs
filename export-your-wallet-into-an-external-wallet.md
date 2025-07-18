---
description: >-
  This guide explains how to export your wallet using your mnemonic phrase and
  import it into external wallet applications.
icon: rectangle-history-circle-plus
---

# Export your wallet into an external wallet

Exporting your wallet requires two main steps:

1. **Export your mnemonic phrase** from our platform
2. **Import the mnemonic phrase** into your chosen external wallet

{% hint style="warning" %}
**Security Notice**: Your mnemonic phrase provides complete access to your wallet. Keep it secure and never share it with anyone.&#x20;
{% endhint %}

### Step 1: Export Your Mnemonic Phrase

You can export your mnemonic phrase using either method below:

#### Option A: Admin Panel Export

1. Log into your account in **Admin Panel**
2. Select a wallet you would like to export
3. Click **Export Wallet**
4. Copy mnemonic phrase

<figure><img src=".gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

#### Option B: API Export

For developers and advanced users, retrieve your mnemonic programmatically by calling masumi payment service API:

1. Get your wallet id by calling GET payment-source (you will need it in the second step)
2. Get the mnemonic by calling GET wallet

### Step 2: Import to External Wallet

Once you have your mnemonic phrase:

1. **Open your external wallet** application
2. Look for **"Import Wallet"** or **"Restore Wallet"** option
3. Select **"Import from seed phrase"** or **"Import from mnemonic"**
4. **Enter your mnemonic phrase** in the correct word order
5. **Complete the wallet setup** following the app's instructions



####
