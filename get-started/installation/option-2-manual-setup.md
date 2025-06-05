---
icon: hands-bubbles
---

# Option 2: Manual setup

**Prerequisites**

* Node.js v18.x or later
* PostgreSQL 15 database
* Blockfrost API Key (to interact with the Cardano blockchain)

***

The node consists of two different repositories. We start with the [Payment Service](https://github.com/masumi-network/masumi-payment-service), which is key to getting started.&#x20;

The Registry Service is not required and is optional to run.

{% stepper %}
{% step %}
### **Cloning the Masumi Payment Service Repository**

Start by cloning the **Masumi Payment Service** repository and installing dependencies:

```bash
git clone https://github.com/masumi-network/masumi-payment-service
cd masumi-payment-service/
npm install
```
{% endstep %}

{% step %}
### **Checking Out the Latest Stable Version**

Ensure you're using the latest stable release:

```bash
git fetch --tags
git checkout $(git tag -l | sort -V | tail -n 1)
```
{% endstep %}

{% step %}
### **Setting Up PostgreSQL**

If you **don’t have PostgreSQL installed**, please refer to:  [installing-postgresql-database.md](../../installing-postgresql-database.md "mention")

#### **Creating the Database:**

```bash
psql postgres
create database masumi_payment;
\q
```
{% endstep %}

{% step %}
### **Configuring Environment Variables**

Copy the `.env.example` file and configure it with your own settings:

```bash
cp .env.example .env
```

Now, open `.env` and update the following variables:

<pre class="language-ini"><code class="lang-ini">DATABASE_URL="postgresql://your_username:your_password@localhost:5432/masumi_payment
ENCRYPTION_KEY="your_secure_key"
ADMIN_KEY="your_admin_key"
<strong>BLOCKFROST_API_KEY_PREPROD="your_blockfrost_api_key"
</strong></code></pre>

{% hint style="info" %}
* **Replace** `"your_username:your_password"` with your actual PostgreSQL credentials.
* Get a free Blockfrost API Key from [blockfrost.io](https://blockfrost.io): [get-blockfrost-api-key.md](../../get-blockfrost-api-key.md "mention")
* Set the Encryption Key: [generate-an-encryption-key.md](../../generate-an-encryption-key.md "mention")
* Admin Key is is your password that you will use to access admin interface later. **It must be 15 characters or longer!**
* If you have more questions about environmental variables, check out [environmental-variables.md](../../environmental-variables.md "mention")
{% endhint %}
{% endstep %}

{% step %}
### **Running Database Migrations**

Run the following commands to configure the database schema:

```bash
npm run prisma:migrate
npm run prisma:seed
```

{% hint style="warning" %}
If you already seeded your database, but you would like to change the Admin Key:

* After changing `ADMIN_KEY` , make sure to set `SEED_ONLY_IF_EMPTY`  to `False` .
* Run seeding command again (see command in the [step 7](option-2-manual-setup.md#id-7.-running-database-migrations))&#x20;

That way, the change of the admin key will propagate to the DB.&#x20;
{% endhint %}
{% endstep %}

{% step %}
### **Install and Build the Admin Interface (Frontend)**

To build the Admin Interface, navigate to /frontend, install the requirements and then navigate back

```bash
cd frontend
npm install
npm run build
cd ..
```
{% endstep %}

{% step %}
### **Start the Masumi Node**

```bash
npm run build && npm start
```
{% endstep %}

{% step %}
### Access the Admin Interface and the Swagger API <a href="#access-the-admin-interface-and-the-swagger-api" id="access-the-admin-interface-and-the-swagger-api"></a>

✅ You can now access the following:

* **Admin Dashboard** → `http://localhost:3001/admin`
* **API Documentation** → `http://localhost:3001/docs`&#x20;

Test the API:

```bash
curl -X 'GET' \
  'http://localhost:3001/api/v1/health/' \
  -H 'accept: application/json'
```

If everything is set up correctly, you should receive:

```json
{
  "status": "success",
  "data": {
    "status": "ok"
  }
}
```
{% endstep %}
{% endstepper %}

