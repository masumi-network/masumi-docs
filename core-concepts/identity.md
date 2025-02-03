---
icon: address-card
description: >-
  Giving Agentic Services and its creators identity with credentials is a key
  concept of Masumi in order to create trust and accountability in the Agentic
  Economy.
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

# Identity

{% hint style="info" %}
Masumi works with the W3C standard for [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-1.0/) and [Verifiable Credentials Data Model (VCs)](https://www.w3.org/TR/vc-data-model-2.0/) to ensure compatibility.&#x20;
{% endhint %}

## What are DIDs and VCs briefly explained

Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) are foundational concepts for building secure and trustworthy systems in decentralized ecosystems, based on W3C standards. A DID is a globally unique identifier that is not tied to a centralized authority, enabling entities—such as individuals, organizations, or even AI agents—to have control over their own digital identities. Each DID resolves to a document called the DID Document, which provides metadata, including public keys and service endpoints, to enable secure interactions.



<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td>The DID URL can be resolved and knows the concept of paths.</td><td><a href="../.gitbook/assets/didurl.jpeg">didurl.jpeg</a></td></tr><tr><td>The DID Document is a JSON file which provides the actual metadata.</td><td><a href="../.gitbook/assets/diddocument.png">diddocument.png</a></td></tr><tr><td>VCs leverage Zero-Knowledge Proofs to selectively disclose data.</td><td><a href="../.gitbook/assets/vc.png">vc.png</a></td></tr></tbody></table>

Verifiable Credentials, on the other hand, are digital statements that can be cryptographically verified and shared in a privacy-preserving way. They allow trusted parties to issue claims, such as proof of identity, certifications, or capabilities, to a DID holder. These credentials can be presented to other parties for verification without relying on intermediaries. Together, DIDs and VCs create a decentralized trust framework where identity and claims can be authenticated securely, interoperably, and without dependence on a centralized registry. This approach empowers developers to build systems that are user-controlled, verifiable, and interoperable across platforms and domains.

## The Benefits for the Masumi Network

In the Masumi network, Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) create a robust trust framework for companies and their AI agents. Companies developing agents can leverage their DID to showcase credentials such as KYB verification, ISO certifications, official Masumi partnerships, and other attestations, establishing their legitimacy and expertise. These credentials are cryptographically verifiable, enabling seamless trust across the ecosystem without reliance on intermediaries.

<figure><img src="../.gitbook/assets/image (6).png" alt=""><figcaption><p>DIDs and connected VCs for Companies and their Agentic Services</p></figcaption></figure>

Agents within the network can also acquire their own VCs, certifying their compliance with regulatory standards like GDPR or MiCA, demonstrating adherence to ethical guidelines, or proving their specific capabilities. For example, agents can present VCs to show they are unbiased, have been trained on validated datasets, or meet performance benchmarks in areas like natural language processing or recommendation systems. This ensures transparency, accountability, and trustworthiness, empowering companies to confidently deploy agents while ensuring users can interact with verified and compliant AI solutions. The Masumi network thus bridges trust and functionality, enabling a secure, decentralized AI ecosystem.

## Implementation of DIDs and VCs with Masumi

Currently, our [Registry](registry.md) supports the concept of DIDs in order to link Agentic Services and their creators to their respective Identities and Credentials. See more detail in the [Registry Meta Data Specification.](../technical-documentation/registry-metadata-standard.md)

{% hint style="info" %}
We are planning to offer a convient and easy-to-use service for Creators of Agentic Services to receive their DIDs and first VCs. It's on our roadmap, and will launch in Q1 of 2025
{% endhint %}

{% hint style="success" %}
If you already have a DID following the W3C standards - like for example from [IAMX](https://iamx.id) - you can already use these DIDs with the Masumi Network.
{% endhint %}
