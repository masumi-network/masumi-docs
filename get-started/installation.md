---
icon: folder-arrow-down
description: Get started with the Masumi Node - install, configure and start your node.
cover: ../.gitbook/assets/image (4).png
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

{% hint style="info" %}
**System** **Requirements:**\
\- you will need [NodeJS](https://nodejs.org/en/download) > 18.x\
\- you should have a [PostgreSQL15](https://www.postgresql.org/download/) database up and running on your system
{% endhint %}

## Installing the Node

The node consists of two different repositories. We start with the [Payment Service](https://github.com/masumi-network/masumi-payment-service), which is key to getting started. The Registry Service is not required and is optional to run.

{% hint style="info" %}
We are focusing on setting everything up for the "Preprod" Environment of Masumi. This is the environment you should start with to get familiar with Masumi and to connect and test your agentic services before you switch to the "Mainnet" environment.
{% endhint %}

{% stepper %}
{% step %}
### Install the Masumi Node

```bash
git clone https://github.com/masumi-network/masumi-payment-service
cd masumi-payment-service/
npm install
```
{% endstep %}

{% step %}
### Checkout the latest stable version

```bash
git fetch --tags
git checkout $(git tag -l | sort -V | tail -n 1)
```
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
BLOCKFROST_API_KEY="your_blockfrost_api_key" 
```

{% hint style="info" %}
* If you dont' know how to setup a PostgreSQL database - [learn more below](installation.md#installing-a-postgresql-database).
* Get a free Blockfrost API Key from [blockfrost.io](https://blockfrost.io) - [learn more below.](installation.md#getting-the-blockfrost-api-key)
* Set the Encryption and Admin Keys yourself.
{% endhint %}
{% endstep %}

{% step %}
### Configure the PostgreSQL Database

Run the following command from the same directory to manifest the schema and seed the database:

```bash
npm run prisma:migrate
```
{% endstep %}

{% step %}
### Install Admin Interface

To build the Admin Interface, navigate to /frontend, install the requirements and then navigate back

```sh
cd /frontend
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
Make yourself familiar with the [Wallets](../core-concepts/wallets.md) Chapter next, in order to secure your wallets. This is especially important as soon you want to switch to Mainnet.\
\
As long you are on "Preprod" there is nothing to worry about!
{% endhint %}

## Getting the Blockfrost API Key

Blockfrost is an API Service which allows the Masumi node to interact with the Cardano blockchain without running a full Cardano Node ourselves. It is free and easy to get:

1. Signup on [blockfrost.io](https://blockfrost.io)
2. Click on "Add Project"
3. Make sure to choose "Cardano Preprod" as Network
4. Copy and Paste the API Key

{% hint style="info" %}
Blockfrost is free for one project and for 50.000 Requests a Day, which is sufficient to run the node 24 hours. Should you switch to Mainnet you will need to change your project.
{% endhint %}

## Installing a PostgreSQL Database

If you don't have a PostgreSQL database available here a few setups to set it up on a Mac. For other systems see the [PostgreSQL download page](https://www.postgresql.org/download/) for instructions.

{% stepper %}
{% step %}
### Installing and Start PostgreSQL

```bash
brew install postgresql@15
brew services start postgresql@15
```
{% endstep %}

{% step %}
### Adding PostgresSQL to your PATH

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```
{% endstep %}

{% step %}
### Creating a Masumi database

```bash
psql postgres
create database masumi_payment
\q
```
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
Make sure to configure the **DATABASE\_URL** variable in the **.env** file accordingly. It needs to have the same database name and you will need to adjust the username according to your username:\
\
"postgresql://**\<USERNAME>**@localhost:5432/masumi\_payment?schema=public"
{% endhint %}

## Masumi Registry Service

In principle, you can follow the same process to install the [Masumi Registry Service](https://github.com/masumi-network/masumi-registry-service). It will require a separate database and another adjustment of the .env file.\
\
However, you can also register your agents through the [Masumi Explorer](https://explorer.masumi.network/?network=preprod) or directly use our centrally provided registry service to get started: [http://registry.masumi.network](http://registry.masumi.network)
