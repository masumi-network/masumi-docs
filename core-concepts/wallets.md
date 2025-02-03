---
icon: sack-dollar
description: >-
  How is the node managing wallets for your Agentic Service? What do you need to
  do to secure your funds in these wallets?
layout:
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Wallets

{% hint style="info" %}
Wallets are key in order to take part in the agentic economy. They store [tokens](token.md) and can make Agentic Services purchases with them. The Cardano [Blockchain](blockchain.md) is the underlying trust layer and financial infrastructure to make payments possible.
{% endhint %}

## Understanding Wallets

The Masumi node uses blockchain-based wallets to enable payments for Agentic Services. Payments can happen both Agent-to-Agent and Human-to-Agent alike. The underlying Blockchain "Cardano" is used for these transactions.

These wallets can work with different kinds of tokens. On Masumi, we use Stablecoins to pay for Agentic Services and the Cardano Native Token "ADA" to pay transaction fees.

## Three different Wallets

The Masumi Node gives you three different wallets, which have very specific roles and attributes.

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td>Receive payments for the services you sell over the Masumi Network.</td><td><a href="../.gitbook/assets/sellingwallet.png">sellingwallet.png</a></td></tr><tr><td>Pay for other services you purchase via the Masumi Network.</td><td><a href="../.gitbook/assets/purchasewallet.png">purchasewallet.png</a></td></tr><tr><td>Secure wallet to withdraw or send funds to the other two wallets.</td><td><a href="../.gitbook/assets/collectionwallet.png">collectionwallet.png</a></td></tr></tbody></table>

The selling wallet and purchase wallet are managed by the Masumi Node and automatically created when you startup the node. The Collection Wallet is optional, managed by yourself, and allows you to regularly withdraw funds from your selling wallet or top-up your purchase wallet.

{% hint style="warning" %}
On the "Preprod" environment we can ignore the Collection Wallet. However, as soon as you switch to "Mainnet" you should setup a collection wallet for safety reasons.
{% endhint %}

## Getting funds into your wallets

While you are learning to use Masumi and test your Agentic Services it is very easy to add funds to your wallets. The underlying blockchain "Cardano" provides a free service called "Faucet" to send Test-ADA to wallets running on the "Preprod" environment.

This Test-ADA is not worth anything and can only be used on this "Preprod" environment for testing purposes.

{% stepper %}
{% step %}
### Open the Admin Dashboard

* Open the Admin Dashboard: [http://localhost:3001/admin/](http://localhost:3001/admin/)
* Navigate to the PREPROD Contract under "Contracts"
* Scroll down to the "Purchasing Wallet"
* Click on the "Copy" icon next to the wallet address
* Click on the "Top up" button, which sends you the [Cardano Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)
{% endstep %}

{% step %}
<figure><img src="../.gitbook/assets/admin dashboard wallet.png" alt=""><figcaption><p>Wallet Management in the Admin Dashboard</p></figcaption></figure>

### Request funds from the Faucet

* Scroll down to the "Delegation" section of the page
* Make sure to select "Preprod Testnet" from the "Environment" drop-down menu
* Paste in the your wallet address into the "Address" field
*   Hit the "Requests Funds" button in the end\


    <figure><img src="../.gitbook/assets/faucet.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Check your wallet

You can now go back to the admin dashboard and after a few minutes you will see 10.000 Test-ADA in your "Purchasing Wallet". Congratulations!
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Repeat the same process for the "Selling Wallet" to have it funded too.
{% endhint %}

## Securing your Masumi Node Wallets

In order to protect your funds in the Selling und Purchase Wallet of the Masumi Node and to not loose what is in there as soon you restart your node, you need to export the "Seed Phrase" of the two wallets and add them to your **.ENV file** of the Node.

{% hint style="warning" %}
While on "Preprod" loosing your funds in Selling und Purchase Wallet is more an inconvience than anything else since you can request new funds from the Faucet. You would only lose real money on Mainnet if you were to not follow these steps.
{% endhint %}



{% stepper %}
{% step %}
### Export the Seed Phrases

* Open the Admin Dashboard: [http://localhost:3001/admin/](http://localhost:3001/admin/)
* Navigate to the PREPROD Contract under "Contracts"
* Scroll down to the "Purchasing Wallet"
* Click on the "Export" to get the Seed Phrases
* Copy your Seed Phrase to the Clipboard

<figure><img src="../.gitbook/assets/wallet secret.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Add Seed Phrase to .ENV file

Open your .ENV file of the Masumi Node and scroll now to the wallet section. Insert the matching seed phrase into file. Do this for the Purchase and Selling Wallet

```bash
#Used to configure payment and purchase wallets
PURCHASE_WALLET_MNEMONIC="hand fix mosquito jar snake auto jeans sadness scan mind accuse elephant december rifle join sell code police offer crowd shield clap buyer priority" 
SELLING_WALLET_MNEMONIC="" 
COLLECTION_WALLET_ADDRESS="" 
```
{% endstep %}

{% step %}
### Store your Seed Phrase Offline

It's very important that you understand that anyone who has access to this Seed Phrase can restore the wallet and control it. Therefore, it is key to protect your system from unwanted access to the .ENV file and also store your Seed Phrase offline on paper. We advise you to write down your Seed Phrase and store it in a really safe place.
{% endstep %}
{% endstepper %}

## Adding a Collection Wallet

While not critical for the "Preprod" Environment, we strongly recommend you to add a Collection Wallet as soon you want to switch to "Mainnet". This Collection Wallet is managed by yourself and you can create one in different ways:

* You could buy a Hardware Wallet like the [Keystone](https://keyst.one), which is the most secure option to manage your funds on a Blockchain, as your Keys are stored on the device and will never appear online
* You could head over to [https://eternl.io](https://eternl.io) and create a new wallet over there and secure your Seed Phrase offline the same way you do for the wallets managed by the Masumi Node
* If you already have an existing Cardano Wallet with funds you can also simply make this your collection wallet.

All you need to do is to add the **wallet address** in the .ENV file - this is really important. Do not copy and paste your seed phrase in this case as you would with the other two wallets. Here, you simply need to add the address!

{% hint style="danger" %}
Make sure that you only add the Wallet Address into the .ENV file for the Collection Wallet and **NOT the Seed Phrase.**
{% endhint %}

## Wallet Management Best Practices

You should follow these best practices when managing your wallets:

1. Minimize the funds you have in the two wallets managed by the Masumi Node. If you have a succesful Agentic Service running on Cardano and collect a lot of money, you should withdraw these funds on a regular basis to the Collection wallet. The Masumi Node also provides a mechanism to automate this. The same is true for the purchasing wallet the other way around.
2. Write down the Seed Phrase of your wallets on paper. Create multiple copies of it and store it in very secure locations. Never show these Seed Phrases to others. Consider that this should be a fire and water safe physical location. If you loose these Seed Phrases you will not be able to recover the wallet and will loose your funds.

