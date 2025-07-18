---
description: Unspent Transaction Output
icon: square-dollar
---

# UTxO

**Definition:** A UTXO is a specific amount of digital currency that remains after a cryptocurrency transaction has been executed. Think of it as the "change" you get back after making a purchase, but in the digital world, it is not a lower denomination—rather, it is a unique output in the blockchain database that can be spent in future transactions

**How It Works:** In UTXO-based blockchains, every transaction consumes one or more existing UTXOs as inputs and creates new UTXOs as outputs. These outputs then become available to be spent in subsequent transactions

**Indivisible Units:** Each UTXO is a discrete and indivisible unit of cryptocurrency. If you want to spend only part of a UTXO, the entire amount is used as input, and any leftover amount is returned to you as a new UTXO (like receiving change in cash transactions)

**Ownership and Security:** UTXOs are associated with a specific owner’s public key. Only the owner of the corresponding private key can spend the UTXO by providing a valid digital signature

**Preventing Double-Spending:** The UTXO model ensures that each output can only be spent once, effectively preventing double-spending attacks. Nodes in the network maintain a set of all UTXOs to validate transactions and ensure integrity

### Example Scenario: Understanding UTXOs on Cardano

Suppose you receive 50 ADA in a transaction from a friend. You now have a **UTXO worth 50 ADA** sitting in your Cardano wallet. This UTXO is like a sealed envelope containing exactly 50 ADA that you can spend.

A few days later, you want to buy an NFT that costs 15 ADA. Here's what happens:

**The Transaction Process:**

1. **Input**: Your wallet takes the entire 50 ADA UTXO as input (you can't just spend part of it - it's all or nothing)
2. **Outputs Created**:
   * The NFT seller receives a new UTXO with 15 ADA + the NFT
   * You receive a new UTXO with 35 ADA as "change" (50 - 15 = 35)
   * A small amount (around 1-2 ADA) goes to transaction fees

**The Result:**

* Your original 50 ADA UTXO is now "spent" and no longer exists
* You have a new 35 ADA UTXO in your wallet
* You also have a new UTXO containing the NFT you purchased
* The seller has a new 15 ADA UTXO

**What Makes Cardano Special:** Unlike Bitcoin, Cardano UTXOs can contain multiple assets. So your "change" UTXO might contain:

* 35 ADA
* Plus any native tokens you already owned
* Plus the new NFT you just bought











