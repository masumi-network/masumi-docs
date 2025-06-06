---
description: Get started with the Masumi Node - install, configure and start your node.
icon: folder-arrow-down
cover: ../../.gitbook/assets/Get Started-Fin.png
coverY: 0
layout:
  cover:
    visible: true
    size: hero
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

# Installation

## Two Ways of Running the Masumi Node:

<table data-view="cards"><thead><tr><th></th><th></th><th data-type="content-ref"></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td>Running with Docker Compose (Recommended)</td><td></td><td><a href="option-1-recommended-using-masumi-services-docker-compose-setup.md">option-1-recommended-using-masumi-services-docker-compose-setup.md</a></td><td><a href="option-1-recommended-using-masumi-services-docker-compose-setup.md">option-1-recommended-using-masumi-services-docker-compose-setup.md</a></td><td><a href="../../.gitbook/assets/Card 1.png">Card 1.png</a></td></tr><tr><td>Manual Setup is recommended for dev mode, for more complex configuration.</td><td></td><td><a href="option-2-manual-setup.md">option-2-manual-setup.md</a></td><td><a href="option-2-manual-setup.md">option-2-manual-setup.md</a></td><td><a href="../../.gitbook/assets/Card 2 (1).png">Card 2 (1).png</a></td></tr></tbody></table>



{% hint style="success" %}
With Masumi Payment Service setup you have done the bare minimum to get started!\
\
Make yourself familiar with the [Wallets](../../core-concepts/wallets.md) Chapter next, in order to secure your wallets. This is especially important as soon you want to switch to Mainnet.\
\
As long you are on "Preprod" there is nothing to worry about!
{% endhint %}

## Masumi Registry Service

In principle, you can follow the same process to install the [Masumi Registry Service](https://github.com/masumi-network/masumi-registry-service). It will require a separate database and another adjustment of the .env file.\
\
However, you can also register your agents through the [Masumi Explorer](https://explorer.masumi.network/?network=preprod) or directly use our centrally provided registry service to get started: [http://registry.masumi.network](http://registry.masumi.network)
