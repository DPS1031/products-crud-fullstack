# 🛍️ Products CRUD — Full Stack App

A full-stack product management application built with **TypeScript**, **Node.js**, **React**, and deployed on **AWS** using **Docker** and **EC2**.

> 🚀 **Live demo:** [http://18.207.180.47](http://18.207.180.47)  
> 🔐 **Credentials:** `admin` / `admin123`

---

## 📸 Preview

| Login | Products Dashboard |
|---|---|
| Sign in with hardcoded auth | Full CRUD — create, edit, delete products |

---

## 🧱 Tech Stack

### Frontend
- **React 18** + **TypeScript** — component-based UI
- **Vite** — lightning-fast dev server and bundler
- **Axios** — HTTP client with request interceptors for auth
- **Nginx** — serves the production build inside Docker

### Backend
- **Node.js** + **Express** + **TypeScript** — REST API
- **better-sqlite3** — lightweight embedded database with seed data
- **Bearer token auth** — middleware-based route protection

### Infrastructure
- **Docker** — multi-stage builds for both services
- **Docker Compose** — local orchestration
- **Amazon ECR** — private container registry for both images
- **Amazon EC2** (t3.micro, Ubuntu 26.04) — hosts both containers
- **AWS IAM Role** — `sts:AssumeRole` for secure EC2→ECR access (no hardcoded credentials)
- **AWS Organizations** — account management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              AWS EC2 (t3.micro)             │
│              Ubuntu 26.04 LTS               │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Frontend        │  │  Backend         │  │
│  │  nginx:alpine    │  │  node:20-alpine  │  │
│  │  :80             │  │  :3000           │  │
│  └─────────────────┘  └────────┬────────┘  │
│                                 │ SQLite     │
└─────────────────────────────────┼───────────┘
                                  │
                    ┌─────────────▼──────────┐
                    │   Amazon ECR (private) │
                    │   frontend:latest      │
                    │   backend:latest       │
                    └────────────────────────┘
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/login` | ❌ | Get bearer token |
| `GET` | `/api/products` | ✅ | List all products |
| `GET` | `/api/products/:id` | ✅ | Get product by ID |
| `POST` | `/api/products` | ✅ | Create product |
| `PUT` | `/api/products/:id` | ✅ | Update product |
| `DELETE` | `/api/products/:id` | ✅ | Delete product |
| `GET` | `/health` | ❌ | Health check |

---

## 📁 Project Structure

```
products-crud-fullstack/
├── backend/
│   ├── src/
│   │   ├── data/products.ts       # SQLite setup + seed
│   │   ├── middleware/auth.ts     # Bearer token middleware
│   │   ├── routes/auth.ts         # Login endpoint
│   │   ├── routes/products.ts     # CRUD endpoints
│   │   └── index.ts               # Express app entry
│   ├── Dockerfile                 # Multi-stage Node build
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.ts          # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Login.tsx          # Auth form
│   │   │   └── ProductList.tsx    # CRUD UI
│   │   ├── types/index.ts         # Shared TypeScript types
│   │   └── App.tsx                # Root component + auth state
│   ├── Dockerfile                 # Multi-stage Vite + nginx build
│   └── package.json
└── docker-compose.yml             # Local dev orchestration
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Docker (optional, for containerized run)

### Option A — Without Docker

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Option B — With Docker Compose

```bash
docker-compose up --build
# Frontend → http://localhost:8080
# Backend  → http://localhost:3000
```

---

## ☁️ AWS Deployment Workflow

```bash
# 1. Authenticate against ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  061513606908.dkr.ecr.us-east-1.amazonaws.com

# 2. Build, tag and push backend
cd backend
docker build -t backend .
docker tag backend:latest 061513606908.dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker push 061513606908.dkr.ecr.us-east-1.amazonaws.com/backend:latest

# 3. Build, tag and push frontend
cd ../frontend
docker build --build-arg VITE_API_URL=18.207.180.47:3000 -t frontend .
docker tag frontend:latest 061513606908.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
docker push 061513606908.dkr.ecr.us-east-1.amazonaws.com/frontend:latest

# 4. SSH into EC2 and pull + run
docker pull 061513606908.dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker pull 061513606908.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
docker run -d -p 3000:3000 061513606908.dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker run -d -p 80:80 061513606908.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

---

## 🔒 Security

- **IAM Role** (`security`) attached to EC2 with `sts:AssumeRole` — EC2 authenticates against ECR using temporary, auto-rotating credentials. No access keys stored anywhere.
- **Bearer token auth** on all product endpoints — unauthenticated requests return `401 Unauthorized`.
- **Private ECR repositories** — images not publicly accessible.
- **Multi-stage Docker builds** — dev dependencies never reach the production image.

---

## 🧠 Key Decisions

| Decision | Rationale |
|---|---|
| SQLite over PostgreSQL | Zero infrastructure overhead for a demo; easy migration path to RDS |
| Multi-stage Docker builds | Smaller images — backend went from ~1GB to 182MB |
| IAM Role vs Access Keys | Industry best practice; credentials rotate automatically |
| Nginx for frontend | Handles SPA client-side routing (`try_files`) correctly |
| EC2 over managed services | Full control, free tier eligible, demonstrates infrastructure knowledge |

---

## 👨‍💻 Author

**David** — Full Stack Developer  
Itagüí, Antioquia, Colombia