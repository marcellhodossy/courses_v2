# Project Name

This README will guide you through installing and running the application.

## Requirements

- Node.js and npm installed on your machine  
- PostgreSQL installed and running (PostgreSQL only supported)

## Installation

1. **Install npm packages**
npm install

2. **Recommended: Install pm2 globally**  
pm2 helps run and manage the application more easily and reliably:
npm install -g pm2

## Setting up the `.env` file

Create a `.env` file in the project root and fill in the necessary environment variables, for example:

PSQL_USERNAME=
PSQL_PASSWORD=
PSQL_HOSTNAME=
PSQL_HOSTPORT=5432
PSQL_DATABASE=

SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_HOSTPORT=
SMTP_HOSTNAME=

SESSION_SECRET=
JSONWEBTOKEN_SECRET=

PORT=3000
LINK= (example https://localhost:3000)

## PostgreSQL Database Setup

1. Access the PostgreSQL shell or use a GUI tool (e.g., pgAdmin).

2. Create a new database:
CREATE DATABASE databasename;

3. (If needed) Create a user and grant privileges:
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE databasename TO user;

4. Import database tables from the `database.sql` file:
psql -U user -d databasename -f database.sql


## Starting the Application

### Development mode
node .

### Production mode with pm2

### Useful pm2 commands

- List running apps:
- pm2 list
- Restart the app:
- pm2 restart app-name
- View logs:
- pm2 logs app-name


