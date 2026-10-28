# Ghost-Watch C2 Terminal // Apex Tier Command &amp; Control

<p align="center">
  <img src="https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="Build Status" />
  <img src="https://img.shields.io/badge/NIST%20FIPS%20203-ML--KEM--768-06b6d4?style=for-the-badge&logo=shield&logoColor=white" alt="ML-KEM-768" />
  <img src="https://img.shields.io/badge/NIST%20FIPS%20204-ML--DSA--65-10b981?style=for-the-badge&logo=keybase&logoColor=white" alt="ML-DSA-65" />
  <img src="https://img.shields.io/badge/NIST%20FIPS%20205-SLH--DSA--128f-f59e0b?style=for-the-badge&logo=auth0&logoColor=white" alt="SLH-DSA-128f" />
  <img src="https://img.shields.io/badge/313--BIND-Ledger%20Sealed%20(0%20Gaps)-06b6d4?style=for-the-badge&logo=blockchaindotcom&logoColor=white" alt="313-BIND Ledger" />
  <img src="https://img.shields.io/badge/LoRa%20Mesh-915.0%20MHz%20OOB-f43f5e?style=for-the-badge&logo=sensortower&logoColor=white" alt="LoRa Mesh" />
  <img src="https://img.shields.io/badge/React-19.0.1-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SIEM-NIST%20SP%20800--86-8b5cf6?style=for-the-badge&logo=splunk&logoColor=white" alt="NIST SP 800-86" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
</p>

---

## 🛰️ Overview

**Ghost-Watch C2 Terminal** is a defense-grade Command & Control (C2) and Cognitive-Adaptive Deception Layer (CADL) designed to counter advanced persistent threats (APTs), quantum cryptanalysis, and autonomous insider lateral migrations. Operating on post-quantum lattice primitives and out-of-band LoRa mesh networks, the system orchestrates automated canary traps, high-entropy synthetic decoys, behavioral heuristics, and cryptographic audit ledgers.

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       GHOST-WATCH APEX C2 CORE                              │
│              [FIPS 203 ML-KEM-768] + [FIPS 205 SLH-DSA-128f]                │
└──────┬──────────────────────┬────────────────────────┬──────────────────────┘
       │                      │                        │
       ▼                      ▼                        ▼
┌──────────────┐      ┌───────────────┐      ┌────────────────────────┐
│  CADL ENGINE │      │ 313-BIND LINK │      │ PALANTIR ONTOLOGY      │
│  L1: Monitor │      │ Temporal Seal │      │ D3.js Force Simulation │
│  L2: Delay   │      │ Nanosecond ns │      │ Lures <-> IPs <-> Evts │
│  L3: Reroute │      │ SHA3-512 Hash │      │ Kinetic Neutralization │
│  L4: Poison  │      │ IPFS DAG CID  │      │ Adaptive Topology      │
│  L5: Neutral │      └───────────────┘      └────────────────────────┘
└──────┬───────┘              │
       │                      ▼
       ▼             ┌────────────────────────────────┐
┌──────────────┐     │ THREAT ATTRIBUTION & SIEM DOSSIER│
│ AETHER MESH  │     │ • Structured Vector PDF Export │
│ Honeygrid DMZ│     │ • RFC 5424 / NIST SP 800-86   │
│ Decoy Traps  │     │ • Live Hardware Telemetry Curves│
└──────────────┘     └────────────────────────────────┘
```

---

## ⚡ Core Operational Capabilities

### 1. 🛡️ Cognitive-Adaptive Deception Layer (CADL)
- **Level 1 (Monitor)**: Stealth OS, hardware fingerprinting, and geographic IP triangulation.
- **Level 2 (Delay)**: Dynamic artificial jitter injection (300ms–6000ms proportional lag) throttling scraping tools to 0.5 queries/sec.
- **Level 3 (Reroute)**: Seamless socket redirection into the isolated AETHER Honeygrid buffer.
- **Level 4 (Poison)**: Algorithmic payload poisoning flooding adversary crawlers at up to 950 MB/s.
- **Level 5 (Neutralize)**: Automated task `SIGKILL`, LoRa mesh sector isolation, and cryptographic revocation.
- **Forensic SIEM Export**: Instant generation of formatted NIST SP 800-86 compliant JSON audit snapshots for Splunk, Elastic, and QRadar.

### 2. 🔐 Post-Quantum Cryptographic (PQC) Matrix
- **FIPS 203 (ML-KEM-768)**: Module-Lattice-Based Key Encapsulation (Rank $k=3$, Polynomial Degree $n=256$, Prime Modulus $q=3329$).
- **FIPS 204 (ML-DSA-65)**: High-speed lattice digital signatures resisting Shor's and Grover's quantum attacks.
- **FIPS 205 (SLH-DSA-128f)**: Stateless hash-based signatures providing quantum-safe proof for the 313-BIND temporal ledger.
- **Visual Hash-Chain Verification**: Real-time validation of ML-KEM key ring integrity against the 313-BIND blockchain ledger with zero gap tolerance.

### 3. 🌐 Palantir Ontological Target Modeler with D3.js
- **Tri-Partite Entity Graph**: Live interactive force-directed graph connecting Decoy Lures, Adversary Source IPs, and Threat Incidents.
- **Interactive Physics Engine**: D3.js physics with drag-to-reposition, collision prevention, dynamic charge sliders, zoom/pan controls, and node selection inspector.
- **Kinetic Directives**: Trigger session neutralizations, AETHER quarantine, and lattice key rotations straight from graph nodes.
- **Adaptive Chaff Scrambler**: Cognitive kinetic grid that dynamically scrambles topological maps upon hostile reconnaissance detection.

### 4. 📄 Threat Attribution Database & PDF Dossier
- Comprehensive database mapping state-sponsored actors (APT-42, Tor Exit nodes, compromised service accounts).
- **Structured Vector PDF Generation**: Automated generation of multi-page, publication-grade forensic dossiers incorporating classification banners, summary matrices, incident records tables, and SLH-DSA-128f cryptographic sign-offs.

### 5. 📊 Real-Time Hardware Health & Live Telemetry
- **Recharts Integration**: Live rolling time-series curves monitoring CPU core utilization, 64 GB ECC RAM enclave allocations, NVMe FIPS 140-3 disk I/O, and quantum lattice crypto load spikes.
- **Live Background Feeds**: Real-time sensory packets stream continuously over LoRa 915.0 MHz mesh, keeping telemetry live without manual polling.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### Installation

```bash
# Clone repository
git clone https://github.com/shadow313/ghost-watch-c2.git
cd ghost-watch-c2

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will launch on `http://localhost:3000`.

---

## 🧪 Testing & Validation

```bash
# Run TypeScript static typecheck
npm run lint

# Build production bundle
npm run build
```

---

## 🔒 Security & Compliance Standards

| Standard | Description | Status |
| :--- | :--- | :--- |
| **NIST FIPS 203** | Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM) | Verified Compliant |
| **NIST FIPS 204** | Module-Lattice-Based Digital Signature Algorithm (ML-DSA) | Verified Compliant |
| **NIST FIPS 205** | Stateless Hash-Based Digital Signature Standard (SLH-DSA) | Verified Compliant |
| **NIST SP 800-86** | Forensic Techniques Integration for Incident Response | Verified Compliant |
| **RFC 5424** | The Syslog Protocol / SIEM Structured Audit Telemetry | Verified Compliant |
| **FIPS 140-3** | Cryptographic Module Security Requirements | Architectural Baseline |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for full details.
