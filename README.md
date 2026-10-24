# Issue Tracking API

A backend for an issue management / ticketing system. Users raise tickets against a
department, support staff and admins review them, update their status and priority, and
everyone communicates through per-ticket comments.

> This README documents the API **as it currently behaves**, and includes a
> [Known issues / roadmap](#known-issues--roadmap) section at the end.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Roles & permissions](#roles--permissions)
- [Data model](#data-model)
- [Project structure](#project-structure)
- [Known issues / roadmap](#known-issues--roadmap)
- [License](#license)

---

## Features

### Implemented

- **Authentication** — signup and login with bcrypt-hashed passwords and JWT access tokens.
- **User management** — view profile, update profile, change password, admin password reset.
- **Tickets** — create a ticket against a department, view your own tickets, view all
  tickets (admin), and view a single ticket.
- **Comments** — add a comment to any ticket (this is the communication channel).
- **Departments** — create, list, read, update and delete departments.
- **Health check** — a simple endpoint that verifies the database connection.

### Not yet implemented

- **Attachments** — the `Attachment` model exists but there is no service, controller or route.
- **Ticket assignment** — the `Ticket.assignedTo` field exists but is never used.
- **Listing comments** — there is no endpoint to read the comments of a ticket.
- **Tickets list for support** — `GET /api/v1/ticket/all` is admin-only.

---

## Tech stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Runtime    | Node.js (ES modules)                         |
| Framework  | Express 4                                    |
| ORM        | Prisma ORM 7 (`prisma-client-js`)            |
| Driver     | `@prisma/adapter-pg` (PostgreSQL driver adapter) |
| Database   | PostgreSQL                                   |
| Auth       | `jsonwebtoken` (JWT) + `bcrypt`              |
| Config     | Prisma 7 config file (`prisma7.config.ts`) + `dotenv` |

---

## Prerequisites

- Node.js 18+ (tested on Node 20+)
- PostgreSQL 14+
- npm

---

## Getting started

```bash
# 1. Clone the repository
git clone <repo-url>
cd issue-tracking-api

# 2. Install dependencies
npm install

# 3. Create the PostgreSQL database (e.g. `issuedb`)

# 4. Create your environment file
cp .env.example .env
# then edit .env and set DATABASE_URL, JWT_SECRET and SECRETE_RESET_PASSWORD

# 5. Run the database migrations
npx prisma migrate dev

# 6. Generate the Prisma Client
#    (required — the generated client is gitignored and not committed)
npx prisma generate

# 7. Start the development server
npm run dev
```

The server starts on `http://localhost:3000` (or the `PORT` value in `.env`).

> **Note:** step 6 is easy to miss. `server/lib/prisma.js` imports the generated client
> from `generated/prisma/client.js`, which is created by `prisma generate`.

---

## Environment variables

Copy `.env.example` to `.env`. All variables are loaded via `dotenv`.

| Variable                 | Required | Description                                                        |
| ------------------------ | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string.                                      |
| `JWT_SECRET`             | Yes      | Secret used to sign JWT access tokens. Use a long random string.   |
| `SECRETE_RESET_PASSWORD` | Yes      | Default password set by the admin password-reset endpoint.         |
| `PORT`                   | No       | HTTP port. Defaults to `3000`.                                     |

> ⚠️ `SECRETE_RESET_PASSWORD` is misspelled (`SECRETE`) in the code and must be spelled
> this way for the reset endpoint to read it. See [known issue #1](#known-issues--roadmap).
> Use a strong random value for `JWT_SECRET` in production.

---

## Scripts

| Script    | Command                          | Description                                   |
| --------- | -------------------------------- | --------------------------------------------- |
| `npm run dev` | `npx nodemon server/src/server.js` | Start the server with auto-reload (dev).  |
| `npx prisma migrate dev` | —                      | Create/apply migrations.                      |
| `npx prisma generate` | —                        | Generate the Prisma Client.                   |

> There is currently no `start` script. Run `node server/src/server.js` for production.

---

## API reference

Base URL: `http://localhost:3000`

### Health

| Method | Path          | Auth  | Description                     |
| ------ | ------------- | ----- | ------------------------------- |
| GET    | `/api/health` | None  | Check server + database status. |

**Response (200):**

```json
{ "status": "ok", "database": "Connected" }
```

---

### Authentication & users

Base path: `/api/v1/user`

| Method | Path                          | Auth       | Roles  | Body / Params                          | Description                       |
| ------ | ----------------------------- | ---------- | ------ | -------------------------------------- | --------------------------------- |
| POST   | `/signup`                     | None       | —      | `{ email, password, name }`            | Register a new user.              |
| POST   | `/login`                      | None       | —      | `{ email, password }`                  | Log in and receive a JWT.         |
| GET    | `/profile`                    | Bearer JWT | any    | —                                      | Get the logged-in user's profile. |
| PATCH  | `/profile`                    | Bearer JWT | any    | `{ name?, email? }`                    | Update name and/or email.         |
| PATCH  | `/profile/password`           | Bearer JWT | any    | `{ currentPassword, newPassword }`     | Change the logged-in user's password. |
| GET    | `/all`                        | Bearer JWT | ADMIN  | —                                      | List all users.                   |
| PATCH  | `/reset-password/:userId`     | Bearer JWT | ADMIN  | `:userId` path param                   | Reset a user's password.          |

**Signup request**

```json
{
  "email": "shuvam@example.com",
  "password": "password123",
  "name": "Shuvam Gautam"
}
```

**Login response (200)**

```json
{
  "success": true,
  "data": {
    "id": "…",
    "name": "Shuvam Gautam",
    "email": "shuvam@example.com",
    "role": "USER",
    "accessToken": "<jwt>"
  }
}
```

Send the token on protected routes:

```
Authorization: Bearer <accessToken>
```

---

### Tickets

Base path: `/api/v1/ticket`

| Method | Path           | Auth       | Roles            | Body / Params                          | Description                          |
| ------ | -------------- | ---------- | ---------------- | -------------------------------------- | ------------------------------------ |
| POST   | `/create`      | Bearer JWT | USER             | `{ title, description, department }`   | Create a ticket.                     |
| GET    | `/all`         | Bearer JWT | ADMIN            | —                                      | List all tickets.                    |
| GET    | `/mytickets`   | Bearer JWT | USER             | —                                      | List the logged-in user's tickets.   |
| GET    | `/:ticketId`   | Bearer JWT | USER, SUPPORT, ADMIN | `:ticketId` path param            | Get a single ticket.                 |
| PATCH  | `/:ticketId`   | Bearer JWT | ADMIN, SUPPORT   | `{ status?, priority? }`               | Update status and/or priority. **Broken / unreachable — see issue #2.** |

**Create ticket request**

```json
{
  "title": "Cannot reset my password",
  "description": "The reset link never arrives.",
  "department": "Support"
}
```

`department` is matched case-insensitively against existing department names.

---

### Comments

Base path: `/api/v1/comment`

| Method | Path          | Auth       | Roles       | Body / Params                | Description                          |
| ------ | ------------- | ---------- | ----------- | ---------------------------- | ------------------------------------ |
| POST   | `/:ticketId`  | Bearer JWT | any         | `{ content }`                | Add a comment to a ticket.           |

> There is currently **no endpoint to list a ticket's comments** (see issue #17).

---

### Departments

Base path: `/api/v1/department`

| Method | Path   | Auth       | Roles          | Body / Params       | Description                 |
| ------ | ------ | ---------- | -------------- | ------------------- | --------------------------- |
| POST   | `/create` | Bearer JWT | ADMIN      | `{ name }`          | Create a department.        |
| GET    | `/all`  | Bearer JWT | ADMIN, USER    | —                   | List all departments.       |
| GET    | `/:id`  | Bearer JWT | ADMIN          | `:id` path param    | Get a department by id.     |
| PATCH  | `/:id`  | Bearer JWT | ADMIN          | `{ newName }`       | Rename a department.        |
| DELETE | `/:id`  | Bearer JWT | ADMIN          | `:id` path param    | Delete a department.        |

---

## Roles & permissions

| Role     | Capabilities                                                                 |
| -------- | ---------------------------------------------------------------------------- |
| `USER`   | Create tickets, view own tickets, view any ticket, comment, update profile.  |
| `SUPPORT`| View any ticket, comment. *(Cannot list all tickets — see issue #9.)*         |
| `ADMIN`  | Everything, plus manage users and departments.                               |

---

## Data model

```
User 1 ──── * Ticket * ──── 1 Department
  │                │
  │                * 
  *                *
Comment        Attachment   (Attachment is currently unused)
```

### `User`

| Field      | Type      | Notes                              |
| ---------- | --------- | ---------------------------------- |
| `id`       | String    | UUID, primary key.                 |
| `name`     | String    |                                    |
| `email`    | String    | Unique.                            |
| `password` | String    | bcrypt hash.                       |
| `role`     | `Role`    | Default `USER`.                    |
| `createdAt`| DateTime  |                                    |

Relations: `tickets`, `comments`.

### `Department`

| Field | Type   | Notes       |
| ----- | ------ | ----------- |
| `id`  | String | UUID, PK.   |
| `name`| String | Unique.     |

Relations: `tickets`.

### `Ticket`

| Field          | Type      | Notes                                        |
| -------------- | --------- | -------------------------------------------- |
| `id`           | String    | UUID, PK.                                    |
| `title`        | String    |                                              |
| `description`  | String    |                                              |
| `status`       | String    | Default `"open"` (free text — see issue #21).|
| `priority`     | String    | Default `"medium"` (free text).              |
| `userId`       | String    | Owner (FK → `User`).                         |
| `departmentId` | String    | FK → `Department`.                           |
| `assignedTo`   | String?   | **Unused** (see issue #18).                  |
| `createdAt`    | DateTime  |                                              |
| `updatedAt`    | DateTime  |                                              |

Relations: `user`, `department`, `comments`, `attachments`.

### `Comment`

| Field       | Type     | Notes                     |
| ----------- | -------- | ------------------------- |
| `id`        | String   | UUID, PK.                 |
| `ticketId`  | String   | FK → `Ticket`.            |
| `userId`    | String   | FK → `User`.              |
| `content`   | String   |                           |
| `createdAt` | DateTime |                           |

### `Attachment`

| Field       | Type     | Notes                  |
| ----------- | -------- | ---------------------- |
| `id`        | String   | UUID, PK.              |
| `ticketId`  | String   | FK → `Ticket`.         |
| `filename`  | String   |                        |
| `url`       | String   |                        |
| `createdAt` | DateTime |                        |

### Enum `Role`

`USER`, `ADMIN`, `SUPPORT`.

---

## Project structure

```
prisma/
├── server/
│   ├── src/
│   │   ├── app.js                 # Express app + route mounting + error handler
│   │   └── server.js              # Entry point (dotenv + listen)
│   ├── lib/
│   │   └── prisma.js              # PrismaClient with the pg driver adapter
│   ├── utils/
│   │   ├── AppError.js            # Custom error class
│   │   ├── asyncHandler.js        # Wraps async handlers to forward errors
│   │   └── jwt.js                 # Sign / verify access tokens
│   ├── middleware/
│   │   ├── authenticate.js        # Validates the Bearer JWT
│   │   ├── authorize.js           # Role-based authorization
│   │   └── error.middleware.js    # Central error handler
│   ├── services/                  # Data access (Prisma queries)
│   ├── controllers/               # Request/response logic
│   └── routes/                    # Route definitions
├── prisma/
│   ├── schema.prisma              # Data model + migrations
│   └── migrations/                # SQL migrations
├── generated/prisma/              # Generated Prisma Client (gitignored)
├── prisma7.config.ts              # Prisma 7 config
├── .env.example                   # Environment template
└── package.json
```
<<<<<<< HEAD

---



## License

ISC
=======
>>>>>>> 98594c4c34bcce2b70d3cf0a3eda0989f1a88766
