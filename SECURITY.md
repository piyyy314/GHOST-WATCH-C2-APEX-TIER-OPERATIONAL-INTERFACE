# Security Policy

## 🛡️ Supported Versions

We actively provide security patches and cryptographic algorithm agility updates for the following versions:

| Version | Supported | PQC Standard |
| :--- | :--- | :--- |
| `2.1.x` | ✅ Active | NIST FIPS 203 / 204 / 205 |
| `2.0.x` | ✅ Active | Kyber Round 3 / Dilithium |
| `< 2.0.0`| ❌ Deprecated | Classical Only |

## 🚨 Reporting a Vulnerability

Security is paramount to the Ghost-Watch C2 architecture. If you discover a cryptographic vulnerability, side-channel attack, or implementation flaw in the post-quantum envelope or 313-BIND temporal ledger:

1. **Do not disclose the issue publicly.**
2. Send an encrypted advisory to the security team at `baalbek.313@gmail.com` or via PGP / ML-KEM key exchange.
3. Provide detailed steps to reproduce, the specific commit hash, and proof-of-concept logs.

We acknowledge receipt within 24 hours and aim to coordinate a patched release and CVE assignment within 72 hours.
