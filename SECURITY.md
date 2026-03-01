# VERITAS AI - Security Checklist

## 1. API Security
- [x] **Server-Side Calls**: All Gemini API calls are proxied through the backend (`server/gemini.ts`). The API Key is never exposed to the client.
- [x] **Rate Limiting**: `express-rate-limit` is configured to prevent abuse (100 requests / 15 min per IP).
- [x] **Environment Variables**: API Keys are loaded via `dotenv` and `process.env`.

## 2. Application Security
- [x] **Helmet**: HTTP headers are secured using `helmet` middleware.
- [x] **Input Validation**: The backend checks for the presence of content before processing.
- [x] **CORS**: configured to allow cross-origin requests (can be tightened for production).

## 3. Data Privacy
- [x] **No Persistence**: The application does not store user data or analysis results in a database. All processing is ephemeral.
- [x] **Data Minimization**: Only the necessary text/file data is sent to the AI model.

## 4. Recommendations for Production
- **HTTPS**: Ensure the production server is served over HTTPS (handled automatically by most PaaS providers).
- **Strict CSP**: Enable Content Security Policy in `helmet` configuration for stricter control.
- **Logging**: Implement a robust logging solution (e.g., Winston, Morgan) for audit trails (ensure PII is redacted).
