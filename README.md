# 🌿 EcoPulse – Track. Measure. Reduce.

> **Next-Generation Corporate Environmental Sustainability & Carbon Accounting SaaS Platform**

EcoPulse is a production-quality, full-stack MERN application engineered to help modern enterprises, campuses, and organizations monitor resource consumption, calculate accurate greenhouse gas (GHG) Scope 1, 2, and 3 emissions, track science-based decarbonization targets, and discover high-ROI operational efficiencies through an AI Sustainability Advisor.

---

## ✨ Key Features & Capabilities

### ⚡ 1. Real-Time Resource Monitoring & Automated GHG Accounting
- **Multi-Resource Ingestion**: Record electricity, diesel fuel, motor gasoline/petrol, natural gas, municipal water, landfill waste, and diverted recycled materials.
- **GHG Protocol Standard Compliance**: Automatically applies standard EPA / DEFRA emission factors and normalizes quantities across metric and imperial unit systems.
- **Live Calculation Transparency**: Watch calculated $kg\text{ CO}_2\text{e}$ update in real-time as you type quantities, displaying the mathematical formula and Scope classification.
- **Interactive Ledger**: Search, filter by resource or date range, and edit or delete historical utility logs.

### 🧠 2. AI Sustainability Advisor (Dual-Mode Intelligence)
- **Deep Footprint Diagnostics**: Analyzes actual multi-month historical activity, Scope breakdown, and seasonal spikes.
- **Dual-Mode Engine**:
  - **Gemini AI API**: When `GEMINI_API_KEY` is provided, generates dynamic, customized decarbonization strategies.
  - **GHG Protocol Rule Engine (Fallback)**: When no key is set, activates a built-in algorithmic recommendation engine calibrated against corporate sustainability benchmarks.
- **Structured Action Plans**: Each recommendation includes priority level, implementation difficulty, estimated $kg\text{ CO}_2\text{e}$ reduction, estimated financial cost savings ($\$ \text{USD}$), payback period, and interactive step-by-step execution checklists.

### 📊 3. Executive Dashboard & Advanced Analytics
- **Animated KPI Stat Cards**: Total carbon footprint ($t\text{ CO}_2\text{e}$), month-over-month trend changes, Scope 2 grid electricity proportion, and active goal tracking.
- **12-Month Carbon Trajectory Area Chart**: Stacked multi-scope trends with gradient fills and interactive tooltips.
- **Scope 1 vs Scope 2 vs Scope 3 Donut Chart**: Clear percentage distribution of direct vs indirect emissions.
- **Intensity Benchmarking**: Evaluates facility efficiency per employee ($kg\text{ CO}_2\text{e}/\text{head}$) and per area ($kg\text{ CO}_2\text{e}/\text{sq m}$ or $\text{sq ft}$) against LEED Gold standards.
- **Resource Cost Correlation**: Dual-axis analysis tracking utility expenditure against environmental impact to identify seasonal waste.

### 🎯 4. Science-Based Sustainability Goals
- **Milestone Trajectory Tracking**: Set target dates and reduction percentages relative to an audited baseline.
- **Dynamic Pacing Analysis**: Automatically recalculates current performance against recent rolling logs to assess if goals are *On Track*, *Achieved*, or *At Risk*.
- **Celebration Physics**: Celebrates milestone achievement with `canvas-confetti` fireworks.

### 🚨 5. Automated Anomaly & Spike Detection
- **Rolling Baseline Scanner**: Automatically flags consumption surges exceeding $25\%$ of the rolling 3-month average.
- **Goal Drift Warnings**: Alerts when time elapsed exceeds $50\%$ while reduction pacing is behind schedule.
- **Actionable Workflow**: Mark alerts as read, resolved, or dismissed.

### 📑 6. Executive Reports & Audit Exports
- **Printable Executive Summary**: Clean layout optimized for PDF generation via browser print (`window.print()`).
- **One-Click CSV Export**: Downloads complete, auditable ledger with timestamps, locations, quantities, emission factors, and scopes for third-party carbon accounting audits.

### ⚡ 7. Instant 1-Click Demo Mode
- **Zero-Setup Evaluation**: Click **"⚡ Explore Live Demo Account"** to immediately sign into an enterprise account pre-populated with **12 months of realistic multi-resource consumption history**, active goals, and alerts.
- **Replenish On Demand**: Reset or regenerate the 12-month demo dataset at any time from the Settings page.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, Axios, Canvas Confetti.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Helmet, CORS, Morgan, Express Rate Limit.
- **Database**:
  - Seamlessly connects to MongoDB Atlas or local MongoDB when `MONGODB_URI` is provided.
  - Automatically spins up an integrated in-memory MongoDB runner (`mongodb-memory-server`) for zero-configuration local runs when no database is installed!
- **AI Engine**: Google Gemini API integration with an automatic GHG Protocol rule-based engine fallback.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/ecopulse.git
cd ecopulse

# Install root, server, and client dependencies
npm run install-all
```

### 2. Environment Variables Configuration
Copy `.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB Connection URI | Leave blank for auto in-memory MongoDB |
| `JWT_SECRET` | Secret key for JWT signing | `ecopulse_jwt_secret_dev_2026` |
| `GEMINI_API_KEY` | Optional Google Gemini API key | Blank (uses rule-based engine fallback) |

> 💡 **Zero Setup Note**: You do **not** need to install or run MongoDB locally! If `MONGODB_URI` is left blank, EcoPulse automatically starts an in-memory database instance.

### 3. Run Development Servers
From the root directory, run both frontend and backend concurrently:
```bash
npm run dev
```

- **Client Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Testing

EcoPulse includes an automated test suite verifying GHG Protocol calculation formulas, unit normalization, JWT authentication, demo login, resource creation, and CSV export.

Run the test suite:
```bash
npm test
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Frontend & Serverless)
EcoPulse includes a pre-configured `vercel.json`:
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Root Directory to `client` or root with `vercel.json` rewrites.
4. Set Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: A secure random secret.
   - `GEMINI_API_KEY`: (Optional) Your Gemini API key.
5. Deploy!

### Deploy to Render / Railway / DigitalOcean (Full Stack)
1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. Configure environment variables in your hosting dashboard.

---

## 🔒 Security & Best Practices
- Passwords salted and hashed with `bcryptjs` (cost factor 10).
- Stateless JWT authentication via HTTP Authorization Bearer headers.
- Rate limiting on authentication routes to mitigate brute-force attempts.
- Security headers enabled via `helmet`.
- Strict user-isolation: all queries scoped to `req.user.id`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
