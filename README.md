# Contract Management Platform (Full Stack)

A professional, enterprise-grade Contract Management Platform built with .NET 10 and Next.js. This platform allows users to design contract blueprints, generate contracts, and manage their full lifecycle through a secure, role-based workflow.

## 🚀 Quick Start

### Option 1: Docker (Recommended)
The easiest way to run the entire stack including the database:
1. Ensure you have **Docker Desktop** installed.
2. Run `docker-compose up --build` in the root directory.
3. Access the **Frontend** at [http://localhost:3001](http://localhost:3001).
4. Access the **API Documentation** at [http://localhost:5140/scalar/v1](http://localhost:5140/scalar/v1).

### Option 2: Local Development

#### 1. Backend Setup (.NET 10)
1. **PostgreSQL**: Ensure PostgreSQL 17 is installed and running.
2. **Database**: Create a database named `contract` in your PostgreSQL instance.
3. **Environment**: Create a `.env` file in `backend/ContractManagement.Api/` with:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=contract
   DB_USER=postgres
   DB_PASS=your_password
   ```
4. **Run**:
   ```bash
   cd backend/ContractManagement.Api
   dotnet run
   ```
   *The system will automatically create tables on startup.*

#### 2. Frontend Setup (Next.js 16)
1. Navigate to `frontend/`.
2. Run `npm install` then `npm run dev -- --port 3001`.

---

## 🏗️ Architecture Overview

The system follows a clean, decoupled architecture:
- **Backend**: ASP.NET Core Web API 10.0 using Entity Framework Core.
- **Frontend**: Next.js 16 (App Router) with TypeScript and Tailwind CSS.
- **Database**: PostgreSQL with `jsonb` support for dynamic field data storage.
- **State Machine**: Enforced at the service layer to ensure data integrity during transitions.

### 🗄️ Database Schema Design
We use a relational database (PostgreSQL) to ensure consistency while utilizing JSON types for flexibility in contract fields.

#### 1. `blueprints`
Stores the templates for contracts.
- `id` (UUID, PK)
- `name` (String)
- `description` (String)
- `fields` (JSONB) - Stores an array of field definitions: `{ type, label, x, y }`.

#### 2. `contracts`
Stores the actual contract instances generated from blueprints.
- `id` (UUID, PK)
- `blueprint_id` (UUID, FK)
- `name` (String)
- `status` (Enum/String) - `Created`, `Approved`, `Sent`, `Signed`, `Locked`, `Revoked`.
- `field_data` (JSONB) - Stores the actual values entered by the user.

#### 3. `contract_history`
Audit log for all status changes.
- `id` (UUID, PK)
- `contract_id` (UUID, FK)
- `from_status` (String)
- `to_status` (String)
- `transitioned_at` (DateTime)
- `action_by` (String) - Mocked role name.

---

## 🔌 API Design Summary

The API follows RESTful principles and is fully documented via **Scalar (OpenAPIv3)**.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blueprints` | `GET` | List all available blueprints |
| `/api/blueprints` | `POST` | Create a new blueprint template |
| `/api/contracts` | `GET` | Get all contracts (Filterable) |
| `/api/contracts` | `POST` | Create a contract from a blueprint |
| `/api/contracts/{id}/transition` | `POST` | Execute status transition (e.g., Approve, Sign) |

### 🛡️ Role-Based Access Control (Mocked)
The backend checks the `X-User-Role` header to enforce business rules:
- **Admin**: Can perform all actions.
- **Approver**: Restricted to `Approve` and `Revoke` actions.
- **Signer**: Restricted to the `Sign` action.

---

## ⚖️ Assumptions & Trade-offs
- **Authentication**: To focus on the core workflow requirements, authentication is mocked via the `X-User-Role` header. This demonstrates the authorization logic without the overhead of OIDC.
- **Positioning**: We implemented explicit X/Y grid coordinates for fields as per the requirement, allowing for future canvas-based rendering.
- **JSONB over EAV**: We chose `jsonb` for contract field data instead of an Entity-Attribute-Value (EAV) pattern to simplify queries and improve performance for read-heavy dashboard operations.

---
## ✅ Requirement Checklist Mapping
- [x] **Blueprint Management**: Full CRUD with configurable fields and positions.
- [x] **Contract Creation**: Inheritance and value entry implemented.
- [x] **Lifecycle Enforcement**: Strict transition rules enforced in `ContractService`.
- [x] **Dashboard**: Filterable listing by Active/Pending/Signed status.
- [x] **Documentation**: Comprehensive README and API docs included.
- [x] **Testing**: Backend xUnit tests and frontend build checks.

---

## 📖 Additional Documentation

- **[Postman Collection](./ContractFlow.postman_collection.json)**: Import this file into Postman to test all endpoints.
- **[PostgreSQL Setup Guide](./POSTGRES_SETUP_GUIDE.md)**: Detailed step-by-step instructions for pgAdmin setup, database creation, and troubleshooting.
---
