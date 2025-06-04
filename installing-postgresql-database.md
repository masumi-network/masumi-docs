---
icon: elephant
---

# Installing PostgreSQL database

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
