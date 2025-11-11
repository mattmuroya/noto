# Noto API and CI/CD Pipeline

Noto is a secure, user-authenticated, session-based note-taking application
backend built with Node.js, Express, and PostgreSQL. It demonstrates layered
REST API architecture with request parsing, schema validation, and error
handling. Formatting, linting, testing, builds, migration, and deployment are
fully automated with GitHub Actions CI/CD.

## Features

- **JWT authentication:** Sliding-window access and refresh token implementation
  for reduced re-authentication request frequency.
- **Session tracking:** Stateful session tracking enables multi-device login.
- **Input/schema validation:** PostgreSQL + Prisma + Zod with fully typed
  database entities and schema validation.
- **Automated testing:** Playwright API integration tests covering all
  authentication and resource endpoints.
- **Code quality enforcement:** TypeScript + Prettier + ESLint for consistent
  code formatting and style.
- **GitHub Actions CI/CD:** Automated formatting, linting, and testing on every
  push and pull request plus automated build-migration-deployment.

## Tech stack

### Core framework

- **TypeScript**
- **Node.js/Express**

### Data

- **PostgreSQL** for data persistence
- **Prisma** for object mapping/database migrations
- **Zod** for schema validation

### Authentication

- **jsonwebtoken** for token generation/validation
- **bcrypt** for password hashing
- **cookie-parser** for handling tokens

### Development Tools

- **ts-node-dev** for hot-load development server
- **ESLint** for code linting
- **Prettier** for Code formatting
- **Playwright** API integration testing

## Architecture

### Key components

- **Multiple environments:** Configuration details such as database
  URL/credentials, port numbers, and token secrets are determined according to
  the runtime environment (local development, testing, CI, production, etc.).
- **Routes:** Modular routing definitions for authentication and resource
  management endpoints with clear indication of where/what data is validated and
  which routes are protected, requiring authentication.
- **Controllers:** Controller layer Handle HTTP requests/responses and delegate.
- **Services:** Service layer implements business logic and database CRUD
  operations.
- **Middleware:** Modular, centralized utilities for various request handling
  functions including validation, authentication, and error handling
- **Schemas:** Schema types and validation rules for request bodies and database
  entities.

### Authentication flow

1. **Login:** User submits credentials; the server verifies the password via
   `bycrypt` and generates an access token (15 minute expiry) and refresh token
   (7 day expiry). The server stores the refresh token in a user session in the
   database and sends the access token back in the response body and the refresh
   token in httpOnly cookie.
2. **Authenticated Requests:** Resource requests sent by the client include the
   access token in the `Authorization` header. The server validates the auth
   token via the `requireAuth` middleware and attaches the authenticated user to
   the request object.
3. **Token Refresh:** The client may request new access tokens without forcing
   user re-authentication as long as the previous session is still active (i.e.
   the user has logged in/made some request within the last 7 days). The client
   sends a request to `/api/auth/refresh`; the server verifies token and session
   in DB, deletes (revokes) the current session, generates new access and
   refresh tokens, and creates a new session.
4. **Logout:** The client may revoke a session manually by calling
   `/api/auth/logout`. The server deletes the session from DB and clears refresh
   cookie, requiring re-authentication on next access. Separate sessions for
   multiple devices/browsers means that access can be revoked on a per-device
   basis.

## Getting started

### Prerequisites

- Node.js 22+
- NPM 10+
- PostgreSQL 14+

### Installation

1. Clone repository

   ```sh
   git clone https://github.com/mattmuroya/noto.git
   cd noto
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Place `.env` in root directory and configure environment variables

   ```env
   PORT=<port>
   DATABASE_URL=<database_url>

   ACCESS_TOKEN_SECRET=<character_string_for_access_token_generation>
   REFRESH_TOKEN_SECRET=<character_string_for_refresh_token_generation>
   ```

4. Start PostgreSQL server (foreground process)

   ```sh
   postgres -D <your-postgres-data-directory>
   ```

5. Init database

   ```sh
   npx prisma migrate deploy
   ```

6. Start development server

   ```sh
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### NPM Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run dev:test` - Manually start test server (handled automatically when
  executing Playwright tests)
- `npm run build` - Compile production build (`tsc`)
- `npm start` - Run compiled application
- `npm test` - Execute Playwright tests (runs against dev server/database -
  requires separate `.env.test` file)
- `npm run reset:test` - Manually reset test database (handled automatically
  when executing Playwright tests)
- `npm run lint` - Run manually linting (ESLint)
- `npm run format` - Run manual format check (Prettier)
- `npm run format:write` - Auto-fix formatting (Prettier)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and generate access/refresh tokens
- `POST /api/auth/refresh` - Rotate refresh token and get new access token
- `POST /api/auth/logout` - Revoke session

### Notes

Notes routes are protected and require a Bearer token via the `Authorization`
header.

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## CI/CD Configuration

The project uses GitHub Actions for automated testing, linting, and formatting.

### GitHub Secrets

The CI/CD pipeline requires the following secrets to be configured in your
GitHub repository:

- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: PostgreSQL database name
- `DATABASE_URL`: Connection string (should match Postgres user/pwd/db) | (e.g.
  `postgresql://user:password@localhost:5432/noto`)
- `PORT`: Test server port number (should match test URL configured in
  Playwright config)
- `ACCESS_TOKEN_SECRET`: Random string for JWT access token generation
- `REFRESH_TOKEN_SECRET`: Random string for JWT refresh token generation

### Workflow: Continuous Integration

**Trigger:** On push to any branch and on pull requests to `main`

1. `lint` job
   - Rus linter (ESLint)
   - Fails if linting errors found

2. `format` job
   - Verifies code formatting (Prettier)
   - Fails if formatting issues found

3. `test` job
   - Starts PostgreSQL service container
   - Checks out repo
   - Installs dependencies
   - Runs integration tests with Playwright
   - Fails if any test fails
   - Uploads test report output artifacts

### Development Workflow

1. Create feature branch

   ```sh
   git checkout -b <feature-branch-name>
   ```

2. Commit changes
3. Push to remote feature branch

   ```sh
   git push -u origin <feature-branch-name>
   ```

4. Create pull request
   - CI runs linter, format check, and tests
   - If failed, fix locally and push changes to branch
5. Confirm merge
   - CI runs again as final validation
