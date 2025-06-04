# Option 1 (Recommended):  Using Masumi Services Docker Compose Setup

#### Prerequisites&#x20;

* Docker and Docker Compose installed
* A Blockfrost API key (get one from [blockfrost.io](https://blockfrost.io))

{% stepper %}
{% step %}
### Clone the repo&#x20;

```
git clone https://github.com/masumi-network/masumi-services-dev-quickstart.git
cd masumi-services-dev-quickstart
```
{% endstep %}

{% step %}
### Copy the environment file template and fill in your values:

```
cp .env.example .env
```
{% endstep %}

{% step %}
### Start the services

```
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

