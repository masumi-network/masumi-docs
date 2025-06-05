---
icon: docker
---

# Option 1 (Recommended):  Using Masumi Services Docker Compose Setup

#### Prerequisites

* Docker and Docker Compose installed
* Blockfrost API key

{% content-ref url="../../get-blockfrost-api-key.md" %}
[get-blockfrost-api-key.md](../../get-blockfrost-api-key.md)
{% endcontent-ref %}

***

{% stepper %}
{% step %}
### Clone the repo&#x20;

```bash
git clone https://github.com/masumi-network/masumi-services-dev-quickstart.git
cd masumi-services-dev-quickstart
```
{% endstep %}

{% step %}
### Copy the environment file template and fill in your values:

```bash
cp .env.example .env
```

For a detailed explanation of environmental variables used and guides on where to find them, please refer to the [environmental-variables.md](../../technical-documentation/environmental-variables.md "mention") section.
{% endstep %}

{% step %}
### Start the services

Make sure docker daemon is running, you can do it by opening docker desktop app or staring it with command tools.&#x20;

Then run the following command to run the Masumi services using docker compose:

```bash
docker compose up -d
```
{% endstep %}

{% step %}
### Access Services

* **Registry Service:** Available at [http://localhost:3000/docs](http://localhost:3000/docs) (for Open-API)
* **Payment Service:** Available at [http://localhost:3001/docs](http://localhost:3001/docs) (for Open-API) or [http://localhost:3001/admin](http://localhost:3001/admin) (for an admin dashboard)
* **PostgreSQL:**  Available at localhost:5432


{% endstep %}
{% endstepper %}

### Common issues

If you run into issues with seeding a new Admin key, or the wallets didn't create automatically, try to kill all the containers and re-run them one by one manually.&#x20;

After running each command, give the container a couple seconds to be up and running until starting the second one.&#x20;

The order is important.&#x20;

{% stepper %}
{% step %}
```bash
docker-compose up postgres
```
{% endstep %}

{% step %}
```bash
docker-compose up registry-service
```
{% endstep %}

{% step %}
```bash
docker-compose up payment-service
```
{% endstep %}
{% endstepper %}
