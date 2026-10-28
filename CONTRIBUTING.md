# Contributing to Ghost-Watch C2 Terminal

Thank you for your interest in contributing to Ghost-Watch C2 Terminal! This repository enforces strict cryptographic standards, static typing, and high reliability for post-quantum command and control infrastructure.

## 🔐 Cryptographic Coding Standards

1. **Post-Quantum Primitive Compliance**:
   - Use NIST FIPS 203 parameters for ML-KEM ($k=3, n=256, q=3329$).
   - Use NIST FIPS 204 parameters for ML-DSA.
   - Use NIST FIPS 205 parameters for SLH-DSA hash-based signatures.
2. **313-BIND Ledger Integration**:
   - Every state-altering operation or forensic artifact export must register a corresponding `BindReceipt` through `temporalBinder.bind_receipt(...)`.
   - Ensure nanosecond timestamps conform to the `...313` suffix requirement.
3. **TypeScript Strict Mode**:
   - Code must pass `npm run lint` (`tsc --noEmit`) with 0 warnings and 0 errors.
   - Do not disable strict mode or use unconstrained `any` types where interfaces exist.

## 🛠️ Development Workflow

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/pqc-enhancement
   ```
2. Ensure all dependencies are cleanly installed:
   ```bash
   npm install
   ```
3. Run local verification before submitting PR:
   ```bash
   npm run lint
   npm run build
   ```
4. Submit your pull request with a descriptive title and summary of changes.

## 📜 Commit Conventions

Follow Conventional Commits:
- `feat(pqc): add visual verification state for hash-chain`
- `fix(acts): resolve property access in crypto verification`
- `perf(cadl): optimize dynamic jitter throttling loop`
- `docs(readme): add NIST FIPS compliance badges`
