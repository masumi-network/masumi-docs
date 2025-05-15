# Step 3: Running the Masumi Payment Service

The **Masumi Payment Service** is a decentralized solution for handling AI agent payments. It provides:

\
&#xNAN;**- Wallet generation** and secure management\
&#xNAN;**- Payment verification** for transactions\
&#xNAN;**- Automated transaction handling**

**Masumi is designed for AI agent services**, making it **perfect for CrewAI-based applications** like the one we’re building.

***

You have 3 ways of running Masumi Node:

## Option 1 (Recommended):  Using [Masumi Services Docker Compose Setup](https://github.com/masumi-network/masumi-services-dev-quickstart)

#### Prerequisites&#x20;

* Docker and Docker Compose installed
* A Blockfrost API key (get one from [blockfrost.io](https://blockfrost.io))

### 1. Clone the repo&#x20;

```
git clone https://github.com/masumi-network/masumi-services-dev-quickstart.git
cd masumi-services-dev-quickstart
```

### 2. Copy the environment file template and fill in your values:

```
cp .env.example .env
```

### 3. Start the services

```
docker compose up -d
```

### 4. Access Services

* **Registry Service:** Available at [http://localhost:3000/docs](http://localhost:3000/docs) (for Open-API)
* **Payment Service:** Available at [http://localhost:3001/docs](http://localhost:3001/docs) (for Open-API) or [http://localhost:3001/admin](http://localhost:3001/admin) (for an admin dashboard)
* **PostgreSQL:**  Available at localhost:5432

## **Option 2: Manual setup with Docker**

### **1. Prerequisites**

Node.js v18.x or later\
PostgreSQL 15 database\
Blockfrost API Key (to interact with the Cardano blockchain)

***

### **2. Cloning the Masumi Payment Service Repository**

Start by cloning the **Masumi Payment Service** repository and installing dependencies:

```bash
git clone https://github.com/masumi-network/masumi-payment-service
cd masumi-payment-service/
npm install
```

***

### **3. Checking Out the Latest Stable Version**

Ensure you're using the latest stable release:

```bash
git fetch --tags
git checkout $(git tag -l | sort -V | tail -n 1)
```

***

### **4. Setting Up PostgreSQL**

If you **don’t have PostgreSQL installed**, follow these steps:

#### **MacOS Installation (via Homebrew)**

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### **Creating the Database**

```bash
psql postgres
create database masumi_payment;
\q
```

### **5. Configuring Environment Variables**

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

#### 1. Database URL

**Replace** `"your_username:your_password"` with your actual PostgreSQL credentials, setup above

#### 2. Encryption Key

You can generate one by running openssl command in terminal:

```
openssl rand -base64 24
```

#### 3. Admin key

&#x20;It is your password that you will use to access admin interface later.

**Must be 15 characters or longer!**

{% hint style="warning" %}
If you already seeded your database, but you would like to change the Admin Key:

* After changing `ADMIN_KEY` , make sure to set `SEED_ONLY_IF_EMPTY`  to `False` . It will add a&#x20;
* Run seeding command again (see command in the [step 7](step-3-running-the-masumi-payment-service.md#id-7.-running-database-migrations))&#x20;

That way, the change of the admin key will propagate to the DB.&#x20;
{% endhint %}

#### 4. Blockfrost API Key

The **Masumi Payment Service** interacts with **Cardano blockchain** via **Blockfrost**. To get a free API key:

1. **Go to** [https://blockfrost.io/dashboard](https://blockfrost.io/dashboard)
2. Click **"Add Project"**
3. **Select "Cardano Preprod"** as the network
4. Copy the **API Key.**

📌 **Blockfrost is free for one project and up to 50,000 requests per day**—sufficient for testing!

🔹 **If switching to Mainnet, update `.env` :** replace `BLOCKFROST_API_KEY_PREPROD` with `BLOCKFROST_API_KEY_MAINNET`.

***

### **7. Running Database Migrations**

Run the following commands to configure the database schema:

```bash
npm run prisma:migrate
npm run prisma:seed
```

***

### **9. Running the Masumi Payment Service**

{% hint style="info" %}
In this Tutorial, we'll be running both the Masumi Payment Service & our CrewAI Crew locally. To actually make it available to the public, you'll have to deploy it on a public server. This can be any service from Digital Ocean, to AWS, Google Cloud, Azure, etc.
{% endhint %}

***

## **Option 3: Running in Development Mode**

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

***

### **10. Verifying Everything Works**

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

***

### **11. Summary**

🚀 **Your Masumi Payment Service is now fully installed!**

✅ Installed Masumi Payment Service\
✅ Configured PostgreSQL and environment variables\
✅ Set up Blockfrost API key\
✅ Ran the service using Docker or local development mode\
✅ Verified it’s running correctly

***
