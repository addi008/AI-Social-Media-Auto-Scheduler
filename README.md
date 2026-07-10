# 🌌 AetherPublish — AI Social Media Auto Scheduler

<p align="center">
  <img src="https://img.shields.io/badge/React-2025-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express-Backend-%23000000.svg?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Vite-Build-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-%238E75C2.svg?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
</p>

AetherPublish is a premium, AI-powered social media auto scheduler featuring a sleek dark-mode user interface, glassmorphism design accents, and direct AI generation capability.

This project is built as a full-stack application with a **Node.js Express backend** and a **React + Vite frontend** that automatically proxies requests and implements automatic client-side fallback storage.

---

## 🎨 Design & Layout Aesthetics
- **Collapsible Sidebar**: A side-navigation menu on desktop that collapses into a sleek icon-only strip to maximize workspace. The preferred view state is persisted automatically across browser refreshes via `localStorage`.
- **Shifted Main Content**: Layout elements and topbars transition smoothly, resolving any overlapping components and giving a high-fidelity visual layout.
- **Glassmorphism Theme**: Fully customized using modern dark-mode palettes, frosted glass panels, subtle hover micro-animations, and Outfit/Plus Jakarta Sans typography.

---

## 🏗️ System Architecture

AetherPublish is built to be resilient. It utilizes a **hybrid database model** that syncs with the local Express server but falls back transparently to browser `LocalStorage` if the backend is offline.

```mermaid
graph TD
    subgraph Client [React Frontend (Vite Client)]
        UI[Glassmorphic UI] -->|fetch /api| Store[storage.js Service]
        Store -.->|Server Offline Fallback| LS[(Browser LocalStorage)]
    end
    
    subgraph Server [Express Backend Server]
        Store -->|Vite Proxy| API[REST API Router]
        API -->|CRUD Operations| DB[(JSON File Database)]
        API -->|Content Generation| AI[Gemini API Integration]
        DB -.->|Local Sync| DataFile[server/data.json]
    end

    classDef default fill:#12162f,stroke:#6366f1,stroke-width:2px,color:#f8fafc;
    classDef highlight fill:#0c0f22,stroke:#06b6d4,stroke-width:2px,color:#fff;
    class UI,Store highlight;
```

---

## 🚀 Key Features

* **AI Creative Studio**: Synthesizes and formats social media copy tailored specifically for **Twitter/X, LinkedIn, Instagram, and Facebook**. Choose your tone (Casual, Professional, Hype, Informative, Witty) and customize emoji/hashtag inclusions.
* **Queue & Calendar Editor**: Plan and schedule posts dynamically, or inspect all schedules in an interactive monthly calendar.
* **Performance Intelligence**: Monitor reach, impressions, link clicks, and engagement values dynamically across a rolling 30-day timeline.
* **Local Data backups**: Take your database with you by exporting backup files (`.json`) or restoring them in the settings page.

---

## 💻 How to Get Started

### 1. Install Dependencies
Initialize libraries and dependencies for both frontend and backend:
```bash
npm install
```

### 2. Run the Development Server
Start the client server (Vite) and backend server (Express + Nodemon) concurrently with a single command:
```bash
npm run dev
```
*Vite will start the client, routing API calls through the configured proxy to port `5000` (where the Express server listens).*

---

## ⚙️ Environment Configuration

- **API Keys**: You can save your Gemini API Key directly inside the **Settings** tab. This is saved to your backend settings database (`server/data.json`) and used securely to generate posts.
- **Environment variables**: Use a `.env` file in the root directory to customize backend ports:
  ```env
  PORT=5000
  ```
