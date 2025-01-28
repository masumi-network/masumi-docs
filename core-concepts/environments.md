---
icon: globe
description: 'Masumi knows two different kind of environments: Mainnet and Preprod.'
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

# Environments

{% hint style="info" %}
The Masumi environments corresponds directly to the underlying [Cardano Blockchain](blockchain.md), which knows exactly the same environments.&#x20;
{% endhint %}

You will encounter in many place related to the [Masumi Node,](masumi-node.md) [Explorer](https://explorer.masumi.network), [Smart Contracts](smart-contracts.md), [Wallets](wallets.md) and more, where we always differentiate betwen the **Preprod** and **Mainnet** environment.

## Preprod (Pre-production Environment)

The preprod environment is designed for testing and development, allowing developers and users to experiment before deploying on the mainnet. This is where you should start to learn to work with Masumi and connect your Agentic Service first.

The Preprod environment allows you to do all the same things as on mainnet, but with zero risks attached.

### Key Characteristics:

* **Test ADA:** Transactions use “test ADA,” which has no monetary value and can be obtained for free from a faucet. See [Wallets](wallets.md) on how to obtain Test Ada.
* **Controlled Testing:** Enables developers to safely test agentic services, new clients, and upgraded [smart contracts](smart-contracts.md) without risking real funds.
* **Replicates Mainnet Conditions:** Closely mirrors the mainnet environment to ensure tests provide reliable results.

### Use-Cases:

* Testing your Agentic Service, espcially when integrating other services
* Testing new smart contracts and decentralized applications.
* Running quality assurance (QA) or user acceptance testing (UAT).
* Testing new Masumi Tools and Templates
* No Risk: Errors or bugs in preprod do not have real-world consequences.

### Regulatory Compliance:

While developing on Preprod you not yet have take into account requirements for [Regulatory Compliance](regulatory-compliance.md), as this is just a development environment. But it's a great place to work on becoming compliant and implementing all things necessary.

### Helpful Preprod Links:

* [Masumi Explorer on Preprod](https://explorer.masumi.network/?network=preprod)
* [Cardanoscan on Preprod](https://preprod.cardanoscan.io)
* [Cardano Faucet for Preprod](https://docs.cardano.org/cardano-testnets/tools/faucet)

{% hint style="info" %}
We recommend you to setup two different environment, where you run the [Masumi Node](masumi-node.md) setup for Preprod purposes and separate this from a Mainnet environment, with separate Masumi Nodes.
{% endhint %}

## Mainnet (Main Network)

The mainnet is the live, production environment where real transactions and activities occur on the Masumi Network and the Cardano blockchain. This is where you use [Stablecoins](token.md) pegged to real-world currencies like the USD to charge for your Agentic Service and start to earn money with your Agentic Service.

{% hint style="danger" %}
We currently don't advise to already deploy on Mainnent. Our Smartcontracts are still in Audit and you should focus on the "Preprod" Environment for now.
{% endhint %}

### Key Characteristics:

* **Real Tokens:** Transactions use actual [$ADA tokens](token.md), which have monetary value and [Stablecoins like USDM](token.md)
* **Live Data:** All transactions, smart contracts, and activities are recorded permanently on the blockchain.
* **Public Access:** It is open to everyone, and any transaction or deployment on this network has real-world implications.

{% hint style="info" %}
As soon we will complete the Smart Contract Audit and are ready for Mainnet, we will announce this accordingly and also provide a guide on how to move from Preprod to Mainnet here in the Documentation.
{% endhint %}

