# 📊 LedgerFlow — Domain-Driven Accounting Dashboard

LedgerFlow is a modern, high-performance accountant tracking frontend dashboard built from scratch using **Nuxt.js (Vue 3)**, **Pinia**, and **TypeScript**, styled with premium **Vanilla CSS** featuring dark/light mode compatibility and a Glassmorphism aesthetic.

This application runs entirely on the client-side with mock database operations backed by **LocalStorage**, allowing full functionality (authentication, data additions, metrics computation, dynamic SVG charts) without any backend server.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher is recommended)

### 1. Install Dependencies
Initialize the project libraries and dependencies:
```bash
npm install
```

### 2. Run the Development Server
Spin up the local hot-reloading development environment:
```bash
npm run dev
```
Once started, open your browser and navigate to the local address displayed in your terminal (usually `http://localhost:3000`).

### 3. Log In (Demo Credentials)
You can log in immediately using the prepopulated CPA accountant credentials:
- **Email**: `accountant@example.com`
- **Password**: `password123`

You can also click **Create Account** to test the registration flow. Any registered account will be saved to your local browser storage.

---

## 📂 Codebase Architecture: Domain-Driven Design (DDD)

Rather than using a traditional layout where files are grouped by technical type (e.g., all components in one folder, all composables in another), LedgerFlow is structured using **Domain-Driven Design (DDD)**. We cluster files by their **business domain feature**.

Here is how the `/src` folder is organized:

```
src/
├── domains/                    # Domain Modules (Isolated feature business logic & UI)
│   ├── auth/                   # Authentication Domain (Users, login/signup forms, sessions)
│   ├── invoice/                # Customer Invoices Domain (Paid, Pending, Overdue tracking)
│   ├── receipt/                # Merchant Receipts Domain (Expense uploading & categorizing)
│   ├── expense/                # Operational Expenses Domain (Rent, software, utilities)
│   ├── bank-record/            # Bank Records Domain (Ledger transactions & balance calculations)
│   └── dashboard/              # Dashboard Domain (Overall statistics aggregation & SVG charts)
│
├── shared/                     # Shared Cross-cutting Utilities and Components
│   ├── components/             # Reusable UI inputs (AppButton, AppInput, AppSelect, AppModal)
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
- **`pages/`**: Contains page shell views or containers specific to that feature (e.g., `LoginPage` inside the `auth` domain).

### Why use DDD on the Frontend?
1. **High Cohesion**: All files relating to a single feature (e.g., Invoices) sit in the same folder. If you need to edit how invoices work, you only look inside `src/domains/invoice/`.
2. **Low Coupling**: Domains do not directly touch each other's private components or stores unless explicitly imported.
3. **Scalability**: As the app grows, you can add new features (e.g., `payroll`, `taxes`) by simply dropping in a new domain folder without cluttering global directories.

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

You do **not** need to write a manual router config file (like `router.js` in standard Vue). Nuxt reads the folder structure and generates the router for you behind the scenes.

### 3. Layouts System
Layouts are reusable wrapper templates defined in the `src/layouts/` directory:
- [auth.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/layouts/auth.vue): Provides the background styling mesh for our login screen.
- [default.vue](file:///home/user/Desktop/frontend_vue_nuxt/src/layouts/default.vue): Implements the main dashboard grid structure, sidebar menu, user profile info, and sign-out buttons.

A page selects which layout it wants to use by declaring metadata (or wrapping elements in `<NuxtLayout name="layoutName">`). This keeps layout structures isolated from the actual page contents.

### 4. Pinia State Stores
Pinia manages reactive state sharing across different components:
- When you add a new invoice in `<InvoiceForm />`, it dispatches a create action on `useInvoiceStore`.
- Because the dashboard's KPI cards and SVG curves are bound to this store's state, Vue automatically triggers recalculations and re-renders them immediately. You do not need to emit events up and down through multiple parent/child layers.

---

## 🔄 Core Application Flows

Here is how data flows through the application:

### 🔑 Authentication Flow
1. **Accessing `/dashboard`**: If a user is not logged in, `useAuth` checks the session in `localStorage`. If empty, it redirects them to `/`.
2. **Submitting Credentials**: Entering email/password inside `LoginForm` calls the `login()` action in `authStore`.
3. **Session Verification**: The `authService` checks the values in `localStorage`. If matching, it returns user data, sets the active session in `localStorage`, and updates the store state, triggering a redirect to `/dashboard`.

### 📊 Dashboard & Calculations Flow
1. **Page Mount**: When `DashboardPage` loads, it triggers a parallel fetch of all data points (Invoices, Receipts, Expenses, and Bank Ledger records) from local storage.
2. **Stats Calculator**: The `dashboardService.calculateStats()` function runs over these lists:
   - **Total Income**: Sum of invoices with status `'Paid'`.
   - **Total Expenses**: Sum of general expenses + merchant receipts.
   - **Net Cashflow**: `Total Income - Total Expenses`.
   - **Bank Balance**: Taken from the latest bank statement transaction ledger balance.
   - **Monthly Trends**: Grouped by transaction dates to build the X-axis coordinate values.
3. **SVG Chart Drawing**: The calculated trend arrays are passed into `StatsChart.vue`. The component scales these values into coordinates matching a SVG viewport box (`0 0 500 220`) and outputs responsive SVG paths with gradient area fills.
4. **Data Mutations**: When you log a new transaction (e.g. a new expense):
   - The expense is saved to `localStorage`.
   - The local stores reactively update their list arrays.
   - The dashboard store notices the state change, triggers a recalculation, and updates the SVG charts and metric cards in real-time.

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
