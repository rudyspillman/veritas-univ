# Deploying VERITAS AI to Vercel

This guide explains how to deploy the application to Vercel with the secure API key configuration.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account.
- A Vercel account (https://vercel.com).
- Your Google Gemini API Key.

## Deployment Steps

1.  **Push to Git**: Ensure this code is pushed to a repository (GitHub/GitLab/Bitbucket).
2.  **Import to Vercel**:
    -   Go to your Vercel Dashboard.
    -   Click **"Add New..."** -> **"Project"**.
    -   Import your repository.
3.  **Configure Project**:
    -   **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it.
    -   **Root Directory**: Leave as `./`.
    -   **Build Command**: `npm run build` (Default).
    -   **Output Directory**: `dist` (Default).
    -   **Install Command**: `npm install` (Default).
4.  **Environment Variables (CRUCIAL)**:
    -   Expand the **"Environment Variables"** section.
    -   Add a new variable:
        -   **Key**: `GEMINI_API_KEY` (Recommended) OR `VITE_GEMINI_API_KEY`
        -   **Value**: Paste your Google Gemini API Key here (starts with `AIza...`).
    -   Click **"Add"**.
5.  **Deploy**:
    -   Click **"Deploy"**.
    -   Wait for the build to complete.

## Verification

Once deployed, Vercel will provide a URL (e.g., `https://veritas-ai.vercel.app`).
Open the URL and try running an analysis. The backend API (`/api/analyze`) will automatically use the key you configured in Step 4.

## Troubleshooting

-   **500 Internal Server Error**: Check the Vercel Function logs. It usually means the API Key is missing or invalid.
-   **404 Not Found**: Ensure `vercel.json` is present in the root directory.
