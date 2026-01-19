# PostgreSQL Setup for pgAdmin

Since the project uses a `.env` file for database configuration, follow these steps to set up your local database:

1. **Open pgAdmin 4** and connect to your server.
2. **Create a new database** named `contract`.
   - Right-click "Databases" -> "Create" -> "Database..."
   - Name: `contract`
   - Owner: `postgres`
3. **Configure the .env file** in the project root or `backend/ContractManagement.Api/`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=contract
   DB_USER=postgres
   DB_PASS=your_password
   ```
4. **Run the Backend**:
   - The tables will be created automatically on the first run.
   - You can verify this in pgAdmin under `contract` -> `Schemas` -> `public` -> `Tables`.

---
## 💡 Troubleshooting
- **Connection Refused**: Ensure the PostgreSQL service is running in your Windows Services.
- **Authentication Failed**: Double-check the `DB_USER` and `DB_PASS` in your `.env` file.
