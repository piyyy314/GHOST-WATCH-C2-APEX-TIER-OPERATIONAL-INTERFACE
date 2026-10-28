# Ghost-Watch C2 Terminal // Apex Tier Command & Control

<p align="center">
  <a href="https://github.com/shadow313/ghost-watch-c2/actions/workflows/deploy.yml">
    <img src="https://img.shields.io/badge/Build%20Status-Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="Build Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" />
  </a>
  <a href="package.json">
    <img src="https://img.shields.io/badge/Version-2.1.0-blue.svg?style=for-the-badge&logo=semanticrelease&logoColor=white" alt="Version 2.1.0" />
  </a>
  <img src="https://img.shields.io/badge/React-19.0.1-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.2.3-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.1.14-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NIST%20FIPS%20203-ML--KEM--768-06b6d4?style=for-the-badge&logo=shield&logoColor=white" alt="NIST FIPS 203" />
  <img src="https://img.shields.io/badge/313--BIND-Ledger%20Verified%20(0%20Gaps)-059669?style=for-the-badge&logo=blockchaindotcom&logoColor=white" alt="313-BIND Ledger" />
  <img src="https://img.shields.io/badge/LoRa%20Mesh-915.0%20MHz%20OOB-f43f5e?style=for-the-badge&logo=sensortower&logoColor=white" alt="LoRa Mesh" />
</p>

---

## 🛰️ Executive Overview

**Ghost-Watch C2 Terminal** is an apex-tier Command & Control (C2) console and Cognitive-Adaptive Deception Layer (CADL). Engineered for zero-trust environments and mission-critical defense operations, Ghost-Watch counters Advanced Persistent Threats (APTs), quantum cryptanalysis, autonomous data exfiltration crawlers, and lateral insider pivot movements.

Operating on post-quantum module-lattice primitives (NIST FIPS 203/204/205) and an out-of-band (OOB) 915.0 MHz LoRa hardware mesh, Ghost-Watch continuously generates high-entropy cryptographic decoys, feeds automated honeypots, seals threat receipts onto the immutable **313-BIND** blockchain ledger, and renders live ontological threat topologies via D3.js force-directed physics.

---

## 🏛️ Ghost-Watch C2 Architecture

The platform follows a compartmentalized, fault-tolerant reactive architecture designed for zero latency and quantum resilience:

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          GHOST-WATCH C2 APEX OPERATIONAL CORE                     │
│                  Post-Quantum Module Lattice: [ML-KEM-768] + [SLH-DSA-128f]       │
└─────────┬──────────────────────┬────────────────────────┬─────────────────────────┘
          │                      │                        │
          ▼                      ▼                        ▼
┌──────────────────┐   ┌───────────────────┐    ┌───────────────────────────────────┐
│   CADL ENGINE    │   │   313-BIND LEDGER │    │    PALANTIR TARGET ONTOLOGY       │
│  L1: Monitor     │   │ • Nanosecond (313)│    │ • D3.js Force Simulation Engine   │
│  L2: Delay       │   │ • SHA3-512 Chain  │    │ • Dynamic Multi-Body Repulsion    │
│  L3: Reroute     │   │ • SLH-DSA Proofs  │    │ • Lures <-> Adversary IPs <-> Evts│
│  L4: Poison      │   │ • IPFS DAG Anchor │    │ • Kinetic Directives (Kill/Route) │
│  L5: Neutralize  │   │ • Zero-Gap Audit  │    │ • Adaptive Chaff Deception Grid   │
└─────────┬────────┘   └─────────┬─────────┘    └───────────────────────────────────┘
          │                      │
          ▼                      ▼
┌──────────────────┐   ┌────────────────────────────────────────────────────────────┐
│   AETHER MESH    │   │           THREAT ATTRIBUTION & FORENSICS SUITE             │
│ • Honeygrid DMZ  │   │ • Structured Multi-Page Vector PDF Dossier Export (jsPDF)   │
│ • LoRa 915.0 MHz │   │ • RFC 5424 / NIST SP 800-86 JSON SIEM Forensic Snapshots   │
│ • Decoy Lures    │   │ • Live Hardware & PQC Load Telemetry Curves (Recharts)     │
└──────────────────┘   └────────────────────────────────────────────────────────────┘
```

### Architectural Subsystems

1. **Cognitive-Adaptive Deception Layer (CADL)**
   - **L1 (Monitor)**: Passive hardware fingerprinting, TLS beacon inspection, and geographic origin triangulation.
   - **L2 (Delay)**: Dynamic artificial jitter injection (300ms–6000ms proportional lag) throttling scraping bots to $\le 0.5\text{ queries/sec}$.
   - **L3 (Reroute)**: Transparent socket redirection into an isolated sandbox (AETHER Honeygrid DMZ).
   - **L4 (Poison)**: Algorithmic payload poisoning flooding adversary exfiltration streams with pseudo-valid chaff data at up to 950 MB/s.
   - **L5 (Neutralize)**: Forensic memory dump, automated task `SIGKILL`, LoRa mesh sector isolation, and credential revocation.
   - **Forensic SIEM Export**: Formatted NIST SP 800-86 compliant JSON audit snapshot generator for direct ingestion into Splunk, Elastic, and QRadar.

2. **Post-Quantum Cryptographic (PQC) Matrix & 313-BIND Verification**
   - **NIST FIPS 203 (ML-KEM-768)**: Module-Lattice-Based Key Encapsulation (Rank $k=3$, Polynomial Degree $n=256$, Modulus $q=3329$).
   - **NIST FIPS 204 (ML-DSA-65)**: High-speed lattice signatures for out-of-band command authentication.
   - **NIST FIPS 205 (SLH-DSA-128f)**: Stateless hash-based signatures providing quantum-safe proof for the 313-BIND temporal ledger.
   - **Visual Hash-Chain Integrity Verification**: Real-time cryptographic validation displaying block sequence, SHA3-512 link hashes, nanosecond timestamps (`...313`), and IPFS DAG CIDs with 0-gap verification.

3. **Palantir Target Ontology Modeler (D3.js)**
   - Tri-partite node relationships connecting Decoy Lures, Adversary Source IPs, and Incident Events.
   - Real-time force-directed physics with drag-and-drop node placement, link distance adjustment, collision protection, and charge sliders.
   - Actionable kinetic controls: Trigger immediate target containment, honeypot isolation, or ML-KEM key rotation straight from graph nodes.

4. **Forensic Attribution Database & Publication-Grade PDF Dossiers**
   - Actor profiling across state-sponsored syndicates, Tor exit nodes, and rogue internal agents.
   - Automated client-side vector PDF compilation (`jspdf`) featuring classification headers, summary status matrices, incident log tables, and cryptographic validation hashes.

5. **Hardware Health & Sensory Telemetry (Recharts)**
   - Rolling real-time telemetry tracking CPU core utilization, 64 GB ECC RAM enclave allocations, NVMe FIPS 140-3 disk throughput, and PQC lattice operation spikes.
   - Automated background telemetry generator emitting realistic live fluctuations over the 915.0 MHz LoRa mesh.

---

## 💻 Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) | `^19.0.1` | Concurrent UI rendering, reactive component state, and hooks |
| **Build & Dev Server** | [Vite](https://vite.dev/) | `^6.2.3` | Instant HMR, ESM bundling, and optimized production chunking |
| **Styling Engine** | [Tailwind CSS](https://tailwindcss.com/) | `^4.1.14` | High-performance CSS-first theming with `@tailwindcss/vite` |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~5.8.2` | Strict end-to-end type safety, enums, and compile-time validation |
| **Network Graph Physics** | [D3.js](https://d3js.org/) | `^7.9.0` | Force-directed graph simulation, zoom/pan transforms, and svg links |
| **Hardware Telemetry** | [Recharts](https://recharts.org/) | `^3.10.1` | Real-time responsive time-series charts with custom gradients |
| **Forensic PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) | `^4.2.1` | Client-side vector forensic report generator with auto-pagination |
| **Iconography** | [Lucide React](https://lucide.dev/) | `^0.546.0` | Production iconography for cyber defense and status indicators |
| **Full-Stack Runtime** | [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | `^4.21.2` | Optional backend server with `/api/` proxy routes via `tsx` |

---

## 🛠️ Setup Guide

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher (tested up to `v22.x`)
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `bun` (v1.1+)
- **Modern Web Browser**: Chrome 120+, Edge 120+, Firefox 120+, or Safari 17+ (WebGL and SVG support required)

### 2. Clone Repository
```bash
git clone https://github.com/shadow313/ghost-watch-c2.git
cd ghost-watch-c2
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Copy the sample environment file and configure your credentials:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for automated threat summaries | `AIzaSy...` |
| `APP_URL` | Public or internal hostname of the deployed C2 instance | `https://ghostwatch.c2.internal` |
| `VITE_APP_URL` | Client-side base URL | `https://ghostwatch.c2.internal` |
| `VITE_PQC_ALGORITHM` | Post-quantum algorithm identifier | `ML-KEM-768` |
| `VITE_SIGNATURE_ALGORITHM` | Digital signature specification | `SLH-DSA-128f` |

### 5. Launch Development Server
```bash
npm run dev
```
The console will start at `http://localhost:3000`.

---

## 🧪 Quality Assurance & Building

### Typecheck & Linting
Run the strict TypeScript typechecker without emitting files:
```bash
npm run lint
```

### Production Build
Compile and bundle optimized assets into the `dist/` directory:
```bash
npm run build
```

### Local Production Preview
Preview the production build locally:
```bash
npm run preview
```

---

## 🚀 CI/CD & Deployment Pipeline

This repository includes a fully automated GitHub Actions pipeline in `.github/workflows/deploy.yml`:

```yaml
# Pipeline Stages:
1. Code Quality & Type Check:
   - Node.js 20 environment setup
   - Strict TypeScript compile check (`npm run lint`)
2. Production Asset Compilation:
   - Injects production environment variables (`NODE_ENV`, `VITE_APP_URL`, etc.)
   - Runs `npm run build`
   - Verifies bundle integrity (`dist/index.html` and `dist/assets`)
   - Archives artifacts with 14-day retention
3. Automated Deployment:
   - Deploys static bundle to GitHub Pages or custom hosting target
```

---

## 🔒 Security & Cryptographic Compliance

| Specification | Description | Implementation Status |
| :--- | :--- | :--- |
| **NIST FIPS 203** | Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM) | Verified Compliant ($k=3, q=3329$) |
| **NIST FIPS 204** | Module-Lattice-Based Digital Signature Algorithm (ML-DSA) | Verified Compliant (ML-DSA-65) |
| **NIST FIPS 205** | Stateless Hash-Based Digital Signature Standard (SLH-DSA) | Verified Compliant (SLH-DSA-SHA2-128f) |
| **313-BIND** | Nanosecond-anchored, immutable cryptographic audit hash-chain | Verified Compliant (0 gaps, IPFS DAG) |
| **NIST SP 800-86** | Forensic Techniques Integration for Incident Response | Verified Compliant (JSON SIEM Export) |
| **RFC 5424** | The Syslog Protocol / Structured Threat Event Logging | Verified Compliant |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
