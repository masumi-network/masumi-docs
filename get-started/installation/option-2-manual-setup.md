# Option 2: Manual setup

**Prerequisites**

Node.js v18.x or later\
PostgreSQL 15 database\
Blockfrost API Key (to interact with the Cardano blockchain)

***

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

If you **don’t have PostgreSQL installed**, please refer to:  [🔗Installing PostgreSQL Database.](../../installing-postgresql-database.md)

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
* Get a free Blockfrost API Key from [blockfrost.io](https://blockfrost.io):[ ](../../get-blockfrost-api-key.md)🔗[How to Get Blockfrost API Ke](../../get-blockfrost-api-key.md)y
* Set the Encryption Key: 🔗[How to Generate an Encryption Key.](../../generate-an-encryption-key.md)
* Admin Key is is your password that you will use to access admin interface later. **It must be 15 characters or longer!**
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
### **Running the Masumi Payment Service**

If you prefer to **run locally without Docker**, follow these steps:

**Step 1: Build the Admin Interface**

```bash
cd frontend
npm install
npm run build
cd ..
```

**Step 2: Start the Masumi Node**

```bash
npm run build && npm start
```

✅ You can now access the following:

* **Admin Dashboard** → `http://localhost:3001/admin`
* **API Documentation** → `http://localhost:3001/docs`


{% endstep %}

{% step %}
### **Verifying Everything Works**

#### **Check if the Service is Running**

If you used **Docker**, verify that the container is running:

```bash
docker ps
```

If running **locally**, check the logs:

```bash
npm start
```

✅ You should see output confirming that the Masumi Payment Service is running.

#### **Test the API**

Once the service is running, test if it's responding:

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

