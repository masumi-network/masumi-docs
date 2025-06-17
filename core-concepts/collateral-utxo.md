---
icon: money-check-dollar-pen
---

# Collateral UTxO

If you don't know what a UTxO is, please first read the UTxO artice:&#x20;

{% content-ref url="utxo.md" %}
[utxo.md](utxo.md)
{% endcontent-ref %}

### What is a Collateral UTXO?

A **collateral UTXO** is a special type of UTXO on Cardano that serves as a security deposit when interacting with smart contracts. It's a designated amount of pure ADA (typically 5-10 ADA) that you set aside specifically for smart contract transactions.

Think of it like a security deposit you put down when renting an apartment - it's there to protect against potential problems, but you get it back if everything goes smoothly.

### How to create a collateral UTxO?

To create a collateral UTxO just send a transaction of around 10ADA to your wallet, from another wallet.&#x20;

Even if you have many ADA on your wallet, it's important to send a separate transaction that will create a unique UTxO containing only the amount you want to use for a collateral. &#x20;
