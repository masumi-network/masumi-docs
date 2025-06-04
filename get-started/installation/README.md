---
description: Get started with the Masumi Node - install, configure and start your node.
icon: folder-arrow-down
cover: ../../.gitbook/assets/image (4).png
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

## 2 Ways of Running the Masumi Node:

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td>Running with Docker Compose (Recommended)</td><td><a href="option-1-recommended-using-masumi-services-docker-compose-setup.md">option-1-recommended-using-masumi-services-docker-compose-setup.md</a></td></tr><tr><td>Manual Setup</td><td><a href="option-2-manual-setup.md">option-2-manual-setup.md</a></td></tr></tbody></table>

## Installing the Node

The node consists of two different repositories. We start with the [Payment Service](https://github.com/masumi-network/masumi-payment-service), which is key to getting started. The Registry Service is not required and is optional to run.

{% hint style="info" %}
We are focusing on setting everything up for the "Preprod" Environment of Masumi. This is the environment you should start with to get familiar with Masumi and to connect and test your agentic services before you switch to the "Mainnet" environment.
{% endhint %}

{% stepper %}
{% step %}
### Install the Masumi Node
{% endstep %}

{% step %}
### Checkout the latest stable version
{% endstep %}

{% step %}
### Configure Environment Variables&#x20;

Copy the .env.example file to a .env file and open it using a text editor of your choice (for example nano)

```bash
cp .env.example .env
nano .env
```

And adjust **only** the following four variables for now.

```python
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/masumi_payment?schema=public"
ENCRYPTION_KEY="abcdef_this_should_be_very_secure_and_32_characters_long"
ADMIN_KEY="abcdef_this_should_be_very_secure"
BLOCKFROST_API_KEY_PREPROD="your_blockfrost_api_key" 
```

{% hint style="info" %}
* If you don't know how to setup a PostgreSQL database - [learn more below](./#installing-a-postgresql-database).
* Get a free Blockfrost API Key from [blockfrost.io](https://blockfrost.io) -[ How to Get Blockfrost API Key](../../get-blockfrost-api-key.md)
* Set the Encryption and Admin Keys yourself.
{% endhint %}
{% endstep %}

{% step %}
### Configure the PostgreSQL Database

Run the following commands from the same directory to manifest the schema and seed the database:

```bash
npm run prisma:migrate
npm run prisma:seed
```
{% endstep %}

{% step %}
### Install Admin Interface

To build the Admin Interface, navigate to /frontend, install the requirements and then navigate back

```sh
cd frontend
npm install
npm run build
cd ..
```
{% endstep %}

{% step %}
### Starting the Node

You can now start the node the following way:

```bash
npm run build && npm start
```
{% endstep %}

{% step %}
### Access the Admin Interface and the Swagger API

Now with the node up and running you can access two web interfaces!

1. [http://localhost:3001/admin/](http://localhost:3001/admin/)
2. [http://localhost:3001/docs/](http://localhost:3001/docs/)
{% endstep %}
{% endstepper %}

{% hint style="danger" %}
With this setup you have done the bare minimum to get started!\
\
Make yourself familiar with the [Wallets](../../core-concepts/wallets.md) Chapter next, in order to secure your wallets. This is especially important as soon you want to switch to Mainnet.\
\
As long you are on "Preprod" there is nothing to worry about!
{% endhint %}

## Masumi Registry Service

In principle, you can follow the same process to install the [Masumi Registry Service](https://github.com/masumi-network/masumi-registry-service). It will require a separate database and another adjustment of the .env file.\
\
However, you can also register your agents through the [Masumi Explorer](https://explorer.masumi.network/?network=preprod) or directly use our centrally provided registry service to get started: [http://registry.masumi.network](http://registry.masumi.network)
