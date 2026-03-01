# VERITAS AI - Deployment Guide

## Architecture Overview

VERITAS AI is a full-stack application designed for independent production deployment.

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **AI Engine**: Google Gemini API (Server-side integration)

## Infrastructure Requirements

- **Runtime**: Node.js v18+
- **Memory**: 512MB RAM minimum (1GB recommended)
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API Key
  - `NODE_ENV`: `production`

## Deployment Options

### 1. Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t veritas-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key veritas-ai
```

### 2. Cloud Platforms (Vercel, Railway, Render, Heroku)

This application is configured as a standard Node.js app.

1. Connect your repository.
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. Add Environment Variable: `GEMINI_API_KEY`

### 3. VPS (Ubuntu/Debian)

1. Install Node.js & Nginx.
2. Clone repo & `npm install`.
3. Build: `npm run build`.
4. Use PM2 to run: `pm2 start server.js --name veritas`.
5. Configure Nginx as a reverse proxy to port 3000.

## Scalability

- The backend is stateless.
- You can horizontally scale by adding more instances behind a load balancer.
- Rate limiting is implemented per-instance (memory store). For distributed rate limiting, replace the memory store with Redis in `server.ts`.
