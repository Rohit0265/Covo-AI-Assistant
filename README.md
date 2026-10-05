# 🤖 Covo AI

> **A full-stack, production-grade AI chat platform built on a microservices architecture.**  
> Multi-model support · Real-time streaming · Razorpay billing · LangGraph agent workflows

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Preview](#-preview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Environment Variables](#2-environment-variables)
  - [3. Start Redis](#3-start-redis)
  - [4. Run Backend Services](#4-run-backend-services)
  - [5. Run the Frontend](#5-run-the-frontend)
- [Running with Docker](#-running-with-docker)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Forking the Project](#-forking-the-project)
- [Future Plans](#-future-plans)
- [License](#-license)

---

## 🌐 Overview

**Covo AI** is a modern AI chat assistant web application that lets users converse with multiple AI models (Google Gemini, Groq, OpenRouter, etc.), perform real-time web searches, generate images, create documents, and manage everything through a clean, minimal dark-mode UI.

It uses a **microservices backend** (4 independent Node.js services behind an Express API Gateway) and a **React + Vite frontend** styled with Tailwind CSS.

---

## 🎥 Preview

*(Replace this placeholder by dragging and dropping your screen recording `.mp4` or `.gif` file right here in the GitHub editor!)*

<div align="center">
  <video src="[https://github.com/user-attachments/assets/your-video-id-here](https://github.com/user-attachments/assets/a56acc77-51d0-47a6-a409-2d2d6d350b3d)" width="800" controls="controls">
  </video>
</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│               React Frontend                │
│         (Vite · Redux · Tailwind)           │
└────────────────────┬────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────┐
│           API Gateway  (Port 3000)          │
│    Express · Cookie Auth · HTTP Proxy       │
└──────┬──────────┬──────────┬────────┬───────┘
       │          │          │        │
  ┌────▼───┐ ┌───▼───┐ ┌────▼──┐ ┌──▼──────┐
  │  Auth  │ │ Chat  │ │ Agent │ │ Billing │
  │  :8001 │ │ :8002 │ │ :8003 │ │  :8004  │
  └────────┘ └───────┘ └───────┘ └─────────┘
       │          │          │        │
       └──────────┴──────────┴────────┘
                        │
              ┌──────────▼──────────┐
              │   MongoDB Atlas     │
              │   Redis (sessions)  │
              └─────────────────────┘
```

All traffic flows through the **API Gateway** which validates authentication via Firebase tokens stored in HTTP-only cookies, then proxies requests to the appropriate microservice.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Model Chat** | Switch between Gemini, Groq, OpenRouter models per conversation |
| 🌐 **Web Search Mode** | Real-time search integration via Tavily for up-to-date answers |
| 🖼️ **Image Generation** | AI image generation support |
| 📄 **Document Generation** | Create PDFs and PowerPoint files via the Agent service |
| 💬 **Conversation History** | Persistent chat history stored per user in MongoDB |
| 💳 **Razorpay Billing** | In-app credit purchases via Razorpay payment gateway |
| 🧠 **LangGraph Workflows** | Agent orchestration with a state-machine graph (router + chat nodes) |
| 🔐 **Firebase Auth** | Secure token-based authentication with Firebase Admin |
| 🎨 **Modern UI** | Dark-mode, animated Orb background, code syntax highlighting |
| 📱 **Responsive Design** | Works across mobile and desktop |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Redux Toolkit** – global state management
- **Tailwind CSS v4** – utility-first styling
- **React Markdown** + **react-syntax-highlighter** – rich message rendering
- **Firebase SDK** – client-side auth
- **Axios** – HTTP client
- **OGL** – WebGL Orb animation

### Backend
- **Node.js** + **Express 5** (all services)
- **MongoDB Atlas** + **Mongoose** – primary database
- **Redis** – session/token caching
- **LangChain / LangGraph** – AI agent orchestration
- **Firebase Admin SDK** – token verification
- **Razorpay SDK** – payment processing
- **AWS S3 SDK** – file storage
- **PDFKit** + **pptxgenjs** – document generation

### AI Providers
- Google Gemini (`@langchain/google-genai`)
- Groq (`@langchain/groq`)
- OpenRouter (`@langchain/openrouter`)
- Tavily Web Search (`@langchain/tavily`)

---

## 📁 Project Structure

```
ai/
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── components/          # UI components (chatArea, sidebar, billing, etc.)
│       ├── component/           # Shared components (Orb animation)
│       ├── features/            # API feature helpers (createOrder.js)
│       ├── pages/               # Route-level pages
│       ├── redux/               # Redux slices & store
│       └── utils/               # Axios instance, firebase config
│
└── backend/
    ├── gateway/                 # API Gateway (port 3000)
    │   ├── middleware/          # Auth protection middleware
    │   ├── controllers/         # /api/me endpoint
    │   └── utils/               # Proxy header helpers
    │
    └── services/
        ├── auth/                # Authentication service (port 8001)
        │   ├── controllers/     # signup, login, logout, refresh
        │   ├── models/          # User model (credits, plan, etc.)
        │   └── routes/
        │
        ├── chat/                # Chat history service (port 8002)
        │   ├── controllers/     # CRUD for conversations & messages
        │   ├── model/
        │   └── routes/
        │
        ├── agent/               # AI Agent service (port 8003)
        │   ├── agents/          # LangChain agent nodes (chat, search, image, doc)
        │   ├── graph/           # LangGraph state machine (router, graph)
        │   ├── config/          # LLM model config
        │   └── utils/
        │
        └── billing/             # Billing service (port 8004)
            ├── controllers/     # create-order, verify-payment
            ├── models/          # Payment model
            └── routes/
```

---

## ✅ Prerequisites

Make sure you have the following installed:

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| Redis | ≥ 7.x |
| Docker & Docker Compose | (optional, for Redis) |
| Git | any recent version |

You will also need accounts/credentials for:
- **MongoDB Atlas** – free cluster works fine
- **Firebase** – project with Authentication enabled
- **Razorpay** – test mode keys
- **Google AI / Gemini API**
- **Groq API**
- **Tavily API** (for web search)
- **AWS S3** (for file storage, optional)

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rohit0265/Covo-AI-Assistant.git
cd Covo-AI-Assistant
```

### 2. Environment Variables

Each service needs its own `.env` file. Create them based on `.env.example` files provided. Here's what each needs:

**`backend/gateway/.env`**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
AGENT_SERVICE_URL=http://localhost:8003
BILLING_SERVICE_URL=http://localhost:8004
```

**`backend/services/auth/.env`**
```env
PORT=8001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/covo-auth
JWT_SECRET=your_jwt_secret_here
FIREBASE_PROJECT_ID=your_firebase_project_id
```
> Place your Firebase `serviceAccountKey.json` inside `backend/services/auth/` (never commit this file).

**`backend/services/chat/.env`**
```env
PORT=8002
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/covo-chat
```

**`backend/services/agent/.env`**
```env
PORT=8003
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/covo-chat
GOOGLE_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
TAVILY_API_KEY=your_tavily_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_s3_bucket
CHAT_SERVICE_URL=http://localhost:8002
AUTH_SERVICE_URL=http://localhost:8001
```

**`backend/services/billing/.env`**
```env
PORT=8004
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/covo-billing
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
AUTH_SERVICE_URL=http://localhost:8001
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 3. Start Redis

Using Docker (recommended):

```bash
cd backend
docker-compose up -d
```

Or install Redis locally and run:
```bash
redis-server
```

### 4. Run Backend Services

Open **5 separate terminals** and run each service:

```bash
# Terminal 1 — API Gateway
cd backend/gateway && npm install && npm run dev

# Terminal 2 — Auth Service
cd backend/services/auth && npm install && npm run dev

# Terminal 3 — Chat Service
cd backend/services/chat && npm install && npm run dev

# Terminal 4 — Agent Service
cd backend/services/agent && npm install && npm run dev

# Terminal 5 — Billing Service
cd backend/services/billing && npm install && npm run dev
```

> **Tip:** Use [PM2](https://pm2.keymetrics.io/) or [concurrently](https://www.npmjs.com/package/concurrently) to manage all services from one terminal.

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** in your browser. 🎉

---

## 🐳 Running with Docker

A `docker-compose.yaml` is included for Redis. Full Docker support for all services is a planned improvement (see [Future Plans](#-future-plans)).

```bash
# Start Redis only
cd backend
docker-compose up -d redis
```

---

## 📡 API Reference

All requests go through the **Gateway at port 3000**.  
Protected routes require a valid Firebase session cookie (`token`).

| Method | Endpoint | Service | Description |
|--------|----------|---------|-------------|
| `POST` | `/api/auth/signup` | Auth | Register new user |
| `POST` | `/api/auth/login` | Auth | Login & set session cookie |
| `POST` | `/api/auth/logout` | Auth | Clear session cookie |
| `GET` | `/api/me` | Gateway | Get current user data & credits |
| `GET` | `/api/chat/conversations` | Chat | List all conversations |
| `POST` | `/api/chat/conversations` | Chat | Create new conversation |
| `GET` | `/api/chat/conversations/:id/messages` | Chat | Get messages in a conversation |
| `POST` | `/api/agent/generate` | Agent | Send prompt & receive AI response |
| `POST` | `/api/billing/create` | Billing | Create a Razorpay order |
| `POST` | `/api/billing/verify` | Billing | Verify payment & top up credits |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Step-by-Step

1. **Fork** the repository (see [Forking the Project](#-forking-the-project))
2. **Clone** your fork locally
3. **Create** a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make** your changes with clear, focused commits:
   ```bash
   git commit -m "feat: add dark mode toggle"
   ```
5. **Push** your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** from your branch into `main`

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no feature change |
| `chore:` | Tooling, dependencies |

### Guidelines

- Write clean, readable code with comments where necessary
- **Never commit `.env` files, `serviceAccountKey.json`, or API keys**
- Keep PRs focused — one feature or fix per PR
- For large features, open an issue first to discuss
- Test your changes locally before submitting

---

## 🍴 Forking the Project

Want to run your own version of Covo AI? Here's how:

1. Click the **Fork** button at the top-right of the GitHub repo page
2. GitHub creates a copy under your account
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Covo-AI-Assistant.git
   ```
4. Add the original as `upstream` to stay in sync with future updates:
   ```bash
   git remote add upstream https://github.com/Rohit0265/Covo-AI-Assistant.git
   ```
5. Pull future updates from the original:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```
6. Set up your own `.env` files and API keys
7. Deploy to your preferred platform (Vercel for frontend, Railway/Render for backend)

---

## 🔮 Future Plans

Covo AI is actively being developed. Here's what's on the roadmap:

### 🏗️ Infrastructure
- [ ] **Full Docker Compose** – One-command startup for all 5 services
- [ ] **Kubernetes support** – Helm charts for production-scale deployment
- [ ] **CI/CD Pipeline** – GitHub Actions for automated testing and deployment
- [ ] **Rate limiting** – Per-user request throttling at the gateway level

### 🤖 AI Features
- [ ] **Voice input/output** – Talk to Covo AI with microphone + TTS playback
- [ ] **File upload & analysis** – Upload PDFs, images, CSVs and ask questions about them
- [ ] **Long-term memory** – Persistent user memory across conversations
- [ ] **Agents marketplace** – Build and share your own specialized agents
- [ ] **Code interpreter** – Execute Python code snippets inside chat
- [ ] **Multi-modal vision** – Send images directly in chat for analysis

### 💰 Billing & Monetization
- [ ] **Subscription plans** – Monthly/annual plans with tiered credit limits
- [ ] **Usage analytics dashboard** – Per-user token usage breakdown
- [ ] **Stripe support** – Global payment gateway alongside Razorpay
- [ ] **Credit auto top-up** – Auto-recharge when credits fall below a threshold

### 🎨 UI / UX
- [ ] **Conversation sharing** – Share a public link to any conversation
- [ ] **Custom themes** – Light mode + user-selectable accent colors
- [ ] **Mobile app** – React Native companion app
- [ ] **Keyboard shortcuts** – Power-user navigation
- [ ] **Artifact sidebar** – Split-panel view for generated documents/code

### 🔌 Integrations
- [ ] **Slack / Discord bot** – Bring Covo AI into your team workspace
- [ ] **Browser extension** – Summarize any webpage with one click
- [ ] **Notion / Google Docs export** – Send AI responses directly to your docs
- [ ] **Webhook support** – Trigger automations from AI responses

