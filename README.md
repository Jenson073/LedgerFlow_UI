# 📊 LedgerFlow — Domain-Driven Accounting Dashboard

LedgerFlow is a modern, high-performance accountant tracking frontend dashboard built from scratch using **Nuxt.js (Vue 3)**, **Pinia**, and **TypeScript**. 

Authentication is managed dynamically using a self-hosted **ZITADEL** IAM service integrated with external Single Sign-On (SSO) providers (**Google** and **Microsoft Entra ID**). Session states are governed by cryptographically secured server-side `httpOnly` cookies.

---

## 🌟 Project Versions

LedgerFlow is developed across two major version releases:

### 🚀 Version 2.0 (Current — Tailwind CSS, ZITADEL OIDC & Receipts Logic)
- **Styling**: Migrated entirely to **Tailwind CSS** integrated with a dynamic, CSS variable-based theming engine (fully supporting light/dark schemes and customizable in [main.css](file:///home/user/Desktop/frontend_vue_nuxt/src/assets/main.css)).
- **Authentication**: Secured with **ZITADEL OIDC (OAuth 2.0 Authorization Code Flow with PKCE)**. Session tokens are saved in secure, server-managed `httpOnly` cookies.
- **SSO Integration**: Federated authentication via **Google SSO** and **Microsoft Entra ID** configured as Identity Providers (IDPs) in ZITADEL.
- **Core Accounting Logic**: 
  - **Total Income**: Computed from merchant/customer **receipts** (`receipts`).
  - **Total Expenses**: Computed from logged **operational expenses** (`expenses`).
  - **Outstanding Dues**: Computed from **Pending** and **Overdue** invoices.
  - **Interactive Actions**: The "Mark Paid" trigger in the invoice ledger is styled as a responsive solid accent button.

### 📜 Version 1.0 (Legacy — Vanilla CSS & Paid Invoices Logic)
- **Styling**: Styled using premium **Vanilla CSS** featuring glassmorphism and custom animation components.
- **Core Accounting Logic**:
  - **Total Income**: Computed from invoices marked with status `'Paid'`.
  - **Total Expenses**: Computed from the sum of general expenses and merchant receipts.
  - **Outstanding Dues**: Computed from unpaid customer invoices.
- **Git Tag**: This stable version has been pushed to Git under the tag `v1.0`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher is recommended)
- [Docker & Docker Compose](https://docs.docker.com/) (to run the self-hosted ZITADEL and PostgreSQL instance)

### 1. Run ZITADEL IAM Infrastructure
ZITADEL is running locally via Docker Compose. Navigate to the compose directory and spin it up:
```bash
cd "/home/user/Desktop/zitadel compose"
docker compose up -d --wait
```
Once started, ZITADEL is accessible at:
- **IAM Console / Issuer ID**: `http://localhost:8080/`
- **Application Client ID**: `379545720174149635`

### 2. Install Project Dependencies
Initialize the Nuxt project libraries:
```bash
npm install
```

### 3. Run the Development Server
Spin up the local hot-reloading development environment:
```bash
npm run dev
```
Navigate to `http://localhost:3000/`. You will be presented with the login screen prompting you to **Sign In with ZITADEL**.

---

## 🔐 ZITADEL SSO Integration Setup Guide

LedgerFlow leverages ZITADEL to federate logins across multiple identity providers. Below are the steps to configure **Google SSO** and **Microsoft Entra ID** as external identity providers.

### 1. Google SSO (OAuth Client Setup)
To allow users to sign in with Google accounts:
1. Navigate to the [Google Cloud Console Auth Clients](https://console.cloud.google.com/auth/clients?authuser=1&organizationId=0&project=ledgerflow-authentication).
2. Click **Create Credentials** -> **OAuth Client ID**.
3. Select **Web Application** as the application type.
4. Add **Authorized JavaScript Origins**:
   - `http://localhost:8080` (Points to the self-hosted ZITADEL proxy domain)
5. Add **Authorized Redirect URIs**:
   - `http://localhost:8080/ui/v2/login/login/externalidp/callback` (Standard callback endpoint where Google sends the auth code back to ZITADEL)
6. Copy the generated **Client ID** and **Client Secret**.

### 2. Microsoft Entra ID (App Registration Setup)
To allow users to sign in with Microsoft accounts:
1. Navigate to the [Microsoft Entra App Registrations portal](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. Click **New Registration**.
3. Name your app (e.g. `LedgerFlow IAM Gateway`) and choose the supported account type (e.g., Multitenant or Single organization).
4. Select **Web** as the Redirect URI platform and configure it with:
   - `http://localhost:8080/ui/v2/login/login/externalidp/callback`
5. Once registered, copy the **Application (client) ID** and **Directory (tenant) ID** from the overview panel.
6. Under **Certificates & secrets**, click **New client secret** and copy the secret **Value**.

### 3. Map Identity Providers (IDPs) in ZITADEL
Once the credentials are created on Google/Microsoft:
1. Log in to the ZITADEL Console at `http://localhost:8080/` as an administrator.
2. Go to **Instance Settings** -> **Identity Providers**.
3. Click **New** -> Select **Google** or **Microsoft**:
   - Paste the respective **Client ID** and **Client Secret**.
   - For Microsoft Entra ID, configure the Tenant option as required (e.g. `common` or specific Tenant ID).
   - Enable scopes: `openid`, `profile`, `email`.
4. Go to **Instance Settings** -> **Login Policy** and toggle your newly created providers to **Active** to render the Google/Microsoft buttons on the ZITADEL login portal interface.

---

## 🔄 Authentication Redirection Lifecycle

Here is how data flows sequentially through the application during sign-in:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Nuxt as Nuxt App (localhost:3000)
    participant Nitro as Nitro Server (/api/auth)
    participant Zitadel as ZITADEL IAM (localhost:8080)
    participant IDP as Identity Provider (Google/MS)

    User->>Nuxt: Clicks "Sign In with ZITADEL"
    Nuxt->>Nitro: GET /api/auth/login
    Note over Nitro: Generates state & PKCE code_verifier.<br/>Stores them in secure cookies.
    Nitro-->>User: 320 Redirect to ZITADEL authorize endpoint
    User->>Zitadel: GET http://localhost:8080/oauth/v2/authorize...
    
    alt Selects Google / Microsoft
        Zitadel-->>User: Redirects to Google/Microsoft Auth page
        User->>IDP: User authenticates with SSO credentials
        IDP-->>User: Redirects back with code to ZITADEL callback
        User->>Zitadel: GET /ui/v2/login/login/externalidp/callback
    else Selects ZITADEL Credentials
        User->>Zitadel: Enters username/password
    end
    
    Zitadel-->>User: Redirects back to Nuxt with authorization code
    User->>Nuxt: GET http://localhost:3000/auth/callback?code=XXX&state=YYY
    Note over Nuxt: Handled by server-side Nitro route.
    Nuxt->>Nitro: Exchange Code
    Note over Nitro: Validates state cookie.<br/>Retrieves PKCE code_verifier.
    Nitro->>Zitadel: POST http://localhost:8080/oauth/v2/token (code + verifier)
    Zitadel-->>Nitro: Returns Access, ID & Refresh Tokens
    Note over Nitro: Sets tokens in HTTP-only, secure=false, sameSite=lax cookies.
    Nitro-->>User: 302 Redirect to /dashboard
    User->>Nuxt: Loads dashboard page (authenticated)
```

### Key Server-Side Route Implementations (Root `server/` Directory)
- [server/api/auth/login.get.ts](file:///home/user/Desktop/frontend_vue_nuxt/server/api/auth/login.get.ts): Creates cryptographically secure OIDC `state` and PKCE `code_verifier`/`code_challenge` parameters. Sets temporary tracking cookies and triggers redirection to ZITADEL.
- [server/routes/auth/callback.get.ts](file:///home/user/Desktop/frontend_vue_nuxt/server/routes/auth/callback.get.ts): Intercepts the final authorization code callback. It performs a backend `POST` query to exchange the code for access/ID/refresh tokens, deletes verification cookies, sets standard token cookies as `httpOnly`, and redirects to `/dashboard`.
- [server/api/auth/logout.get.ts](file:///home/user/Desktop/frontend_vue_nuxt/server/api/auth/logout.get.ts): Clears access, ID, and refresh token cookies locally, then redirects to ZITADEL's `end_session` endpoint with an `id_token_hint` parameter to log the user out completely.
- [server/api/auth/me.get.ts](file:///home/user/Desktop/frontend_vue_nuxt/server/api/auth/me.get.ts): Checks the `id_token` cookie, parses the base64url encoded payload segment, and extracts OIDC claims (e.g. `sub`, `name`, `email`) to serve current profile properties to the sidebar layouts.

---

## 🛡️ Route Protection & Session Checks

Authentication is managed via Nuxt's global route middleware [middleware/auth.global.ts](file:///home/user/Desktop/frontend_vue_nuxt/src/middleware/auth.global.ts):
- During navigation, the middleware invokes the client composable `fetchUser()` action.
- During initial SSR page loads, `useAuth()` forwards browser cookies to the backend endpoint `/api/auth/me` using `useRequestHeaders(['cookie'])`.
- If the user is unauthenticated and attempts to visit `/dashboard`, they are redirected to `/`.
- If an authenticated user attempts to visit the `/` login landing page, they are automatically forwarded to `/dashboard`.

---

## 📂 Codebase Architecture: Domain-Driven Design (DDD)

Rather than using a traditional layout where files are grouped by technical type (e.g., all components in one folder, all composables in another), LedgerFlow is structured using **Domain-Driven Design (DDD)**. We cluster files by their **business domain feature**.

Here is how the `/src` folder is organized:

```
src/
├── domains/                    # Domain Modules (Isolated feature business logic & UI)
│   ├── invoice/                # Customer Invoices Domain (Paid, Pending, Overdue tracking)
│   ├── receipt/                # Merchant Receipts Domain (Expense uploading & categorizing)
│   ├── expense/                # Operational Expenses Domain (Rent, software, utilities)
│   ├── bank-record/            # Bank Records Domain (Ledger transactions & balance calculations)
│   └── dashboard/              # Dashboard Domain (Overall statistics aggregation & SVG charts)
│
├── shared/                     # Shared Cross-cutting Utilities and Components
│   ├── components/             # Reusable UI inputs (AppButton, AppInput, AppSelect, AppModal)
│   ├── composables/            # Shared useAuth session state composables
│   ├── utils/                  # Utility helpers (localStorage storage, date/currency formatters)
│   └── services/               # Common mock configurations
│
└── app.vue                     # Global entrypoint rendering the active Nuxt route
```

### Inner Folder Structure of a Domain Module
Within each domain folder (e.g., `src/domains/invoice/`), the code is divided into standard subfolders based on architectural responsibility:
- **`types/`**: Holds TypeScript interfaces and type definitions (e.g., `Invoice` and `CreateInvoiceInput`) defining the domain's core data structures.
- **`services/`**: Implements domain operations and interacts with data repositories (e.g., reading/writing data lists to LocalStorage, validating business parameters).
- **`store/`**: Defines the Pinia state management store (e.g., `useInvoiceStore`) to hold current reactive state lists and expose actions.
- **`composables/`**: Exposes lightweight Vue composition functions (e.g., `useInvoice`) wrapping store states and methods for presentation binding.
- **`components/`**: Holds isolated UI elements specific only to this domain (e.g., `InvoiceTable` lists, `InvoiceForm` modal inputs).
- **`pages/`**: Contains page shell views or containers specific to that feature.

---

## 💡 Nuxt.js Concepts for Beginners

If you are new to Nuxt, here is a beginner-friendly breakdown of how the framework works under the hood:

### 1. What happens during `npm run dev`?
When you run `npm run dev`, Nuxt initiates a local server backed by **Vite**. 
- Vite performs on-demand compiling: instead of bundling the whole application before starting, it serves files directly to the browser as modern ES Modules (ESM) and compiles only what you are currently viewing.
- Nuxt generates type definitions and builds configuration links in the hidden `.nuxt/` folder to coordinate auto-imports.

### 2. File-Based Routing
Nuxt handles page routing automatically based on files placed inside the `src/pages/` directory:
- [src/pages/index.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/pages/index.vue) maps to the root URL `/`.
- [src/pages/dashboard.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/pages/dashboard.vue) maps to `/dashboard`.

You do **not** need to write a manual router config file. Nuxt reads the folder structure and generates the router for you behind the scenes.

### 3. Layouts System
Layouts are reusable wrapper templates defined in the `src/layouts/` directory:
- [auth.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/layouts/auth.vue): Provides the background styling mesh for our login screen.
- [default.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/layouts/default.vue): Implements the main dashboard grid structure, sidebar menu, user profile info, and sign-out buttons.

### 4. Pinia State Stores
Pinia manages reactive state sharing across different components:
- When you add a new invoice in `<InvoiceForm />`, it dispatches a create action on `useInvoiceStore`.
- Because the dashboard's KPI cards and SVG curves are bound to this store's state, Vue automatically triggers recalculations and re-renders them immediately.

---

## 🐳 Docker Deployment

You can run LedgerFlow inside a container. The project is equipped with a production-ready, multi-stage `Dockerfile`.

### Pull from Docker Hub (Recommended)
This application has been precompiled and pushed to Docker Hub. You can pull the latest image and run it directly without building locally:
```bash
# Pull the latest image from Docker Hub
docker pull jenson07/ledgerflow-app-nuxt:latest

# Run the container mapping it to port 3000
docker run -p 3000:3000 jenson07/ledgerflow-app-nuxt:latest
```

### Build the Docker Image Locally
If you want to compile and build the container locally from the source files:
```bash
# Build the Docker image
docker build -t ledgerflow-app .

# Run the local container
docker run -p 3000:3000 ledgerflow-app
```
Once running, you can access the application at `http://localhost:3000`.

---

## 🛠️ Troubleshooting & Common Configuration Errors

If you run into issues while testing your ZITADEL or SSO integration, verify the following configurations:

### 1. `redirect_uri_mismatch` on ZITADEL
- **Problem**: Occurs when ZITADEL redirects the user back to Nuxt, but the target Callback URL does not match what ZITADEL has configured for the client application.
- **Fix**: Open the ZITADEL console, navigate to your Project -> App Settings, and ensure that the **Redirect URI** is explicitly set to:
  `http://localhost:3000/auth/callback` (matching trailing slashes and ports exactly).

### 2. `redirect_uri_mismatch` on Google or Microsoft
- **Problem**: Occurs when Google or Microsoft redirects the user back to ZITADEL, but ZITADEL's callback URL does not match the allowed redirect list in Google Cloud or Microsoft Entra ID.
- **Fix**: Ensure that ZITADEL's external callback endpoint is exactly added to the provider console:
  `http://localhost:8080/ui/v2/login/login/externalidp/callback`

### 3. `invalid_client` or Invalid Client Secret
- **Problem**: ZITADEL fails to fetch user details from Google or Microsoft during code exchange.
- **Fix**: Check that the **Client Secret** value (not the Secret ID) was copied correctly from Entra ID or Google Console. Make sure there are no trailing whitespaces.

### 4. 404 Page Not Found on `/api/auth/login`
- **Problem**: Nuxt fails to locate the backend server route.
- **Fix**: In Nuxt, the `server/` folder must live at the **root of the project directory** (sibling to `nuxt.config.ts`), *not* inside the `src/` directory. Double check that it is placed in `./server/` instead of `./src/server/`.
