# GovBridge

A unified platform for Jamaican government services — integrating national identity verification (NIDS/JDXP), digital payments (Jam-Dex), and on-chain document verification into a single citizen-facing application.

Built solo in 24 hours at the **Intellibus 2026 Hackathon** (March 14-15, National Arena, Kingston, Jamaica).

**Top 10 finish**, with recognition from the Minister of Efficiency, Innovation, and Digital Transformation.

> **Note:** The live demo is no longer accessible. The AWS infrastructure (EKS cluster, RDS database, load balancers, etc.) has been torn down following the hackathon. The repository remains as a reference for the architecture and implementation.

---

## The Problem

Jamaican citizens must navigate three separate government agencies — TAJ, RGD, and JCF — each with its own identity checks, payment methods, and processing timelines just to obtain basic certificates like tax compliance letters, birth certificates, and police records. Roughly 10% of Jamaican adults lack any formal identification. Government offices remain overburdened, digital portals are fragmented across agencies, and many steps still require in-person visits with physical documents.

Jamaica is actively building the infrastructure to modernize this: **NIDS** (National Identification System) is enrolling citizens at 19 sites with $1.86B allocated for 2026/27, **JDXP** (Jamaica Data Exchange Platform) is piloting interoperable identity verification with financial institutions, and **Jam-Dex** (Jamaica's CBDC) saw 550% transaction growth in 2025. But there is no citizen-facing layer that ties these systems together.

GovBridge is that layer.

---

## What It Does

GovBridge consolidates identity verification, payments, and document issuance into a single dashboard. Citizens verify their identity once, pay government fees with Jam-Dex, and receive blockchain-verified digital certificates — all without visiting a government office.

| Service | Without GovBridge | With GovBridge |
|---|---|---|
| **Tax Compliance (TAJ)** | Online application exists, but requires in-person visit with documents and interview. 24+ hours processing. | Request from dashboard, pay with Jam-Dex, receive verified digital certificate. |
| **Birth Certificate (RGD)** | Must know birth entry number. No number means manual mail-in. 2-6 weeks. US$55-85. | Request from dashboard, verified certificate in minutes. |
| **Police Record (JCF)** | Fill online form, print it, attend appointment. 5-21 working days. J$3,000-6,000. | Request from dashboard, blockchain-verified result. |
| **Identity** | Present different documents at each agency | Verify NIN once via JDXP with citizen consent |
| **Payments** | Separate payment method per agency | Single Jam-Dex CBDC payment rail for all fees |
| **Verification** | Phone calls to the issuing agency, notarized copies mailed internationally | On-chain hash lookup — instant, independent, publicly verifiable |

This is especially valuable for the Jamaican diaspora, who currently mail physical documents internationally and wait weeks for agency verification.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│              React + TypeScript (Vite)                    │
│  /login  /about  /dashboard  /pay/:id  /verify /analytics│
└────────────┬──────────────────────────────┬──────────────┘
             │ REST (JSON) + WebSocket      │ ethers.js (read-only)
             ▼                              ▼
┌──────────────────────────────────────────────────────────┐
│              Spring Boot 3.x (Java 21)                   │
│                                                          │
│  AuthController     → NidsService                        │
│  RequestController  → RequestService  → EventProducer    │
│  PaymentController  → PaymentService  → ChainService     │
│  AnalyticsController                                     │
│                                                          │
│  WebSocketRelay ← EventConsumer ← Kafka                  │
└──────┬───────────────┬────────────────────┬──────────────┘
       │               │                    │
       ▼               ▼                    ▼
┌────────────┐  ┌────────────┐  ┌──────────────────────┐
│ PostgreSQL │  │ Snowflake  │  │   Base Sepolia (L2)  │
│            │  │ (analytics)│  │                      │
│ citizens   │  │            │  │  DocVerify.sol       │
│ requests   │  │            │  │  PaymentReceipt.sol  │
│ payments   │  │            │  │                      │
│ documents  │  └────────────┘  └──────────────────────┘
└────────────┘
```

### Key Design Decisions

- **All contract writes happen server-side.** The frontend never connects a wallet. The Spring Boot backend holds the deployer key and calls contracts via Web3j, while the frontend reads from contracts using a public JSON-RPC provider. This eliminates MetaMask popups, network switching, and wallet UX friction entirely.

- **Kafka powers real-time updates.** Every state change — service request status, payment confirmation, on-chain anchoring — is published to a Kafka topic. A WebSocket relay consumes all topics and broadcasts to connected frontends via STOMP/SockJS, giving the application a live, reactive feel.

- **Identity with consent.** Citizens verify their 9-digit NIN through a simulated JDXP integration that includes a consent step, reflecting the voluntary data-sharing requirement of the NIRA Act, 2021.

- **On-chain document verification.** Each issued document is SHA-256 hashed and anchored on Base Sepolia (Ethereum L2) via the `DocVerify.sol` contract. Any third party can verify a certificate's authenticity instantly by entering its hash on the public verification page — no account or login required.

- **Jam-Dex CBDC payments.** All government fees are payable through a simulated Jam-Dex integration. One payment rail, no cash, no bank transfers, no separate POS terminals.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Spring Boot 3.4, Java 21 (Temurin), PostgreSQL, Apache Kafka, Web3j 4.10.3 |
| **Frontend** | React 19, TypeScript, Vite 8, TailwindCSS 4, ethers.js 6, STOMP/SockJS |
| **Smart Contracts** | Solidity 0.8.24, Foundry, deployed to Base Sepolia (chain ID 84532) |
| **Infrastructure** | AWS EKS, RDS, ECR, Terraform, GitHub Actions CI/CD |

---

## Project Structure

```
govbridge/
├── backend/          # Spring Boot API (controllers, services, Kafka, Web3j)
├── frontend/         # React SPA (pages, components, hooks)
├── contracts/        # Solidity smart contracts (DocVerify, PaymentReceipt)
├── infra/            # Terraform modules for AWS (EKS, RDS, ECR, networking)
└── k8s/              # Kubernetes manifests for deployment
```

---

## Running Locally

**Prerequisites:** Java 21, Node 24, PostgreSQL, Kafka (optional — the app handles Kafka unavailability gracefully)

```bash
# Backend
cd backend
./gradlew bootRun

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

The frontend dev server proxies API requests to the backend. The app is fully functional without Kafka — real-time WebSocket updates simply won't fire.

---

## Government Agencies Referenced

| Abbreviation | Full Name | Role |
|---|---|---|
| **TAJ** | Tax Administration Jamaica | Tax compliance certificates, tax payments |
| **RGD** | Registrar General's Department | Birth, death, and marriage certificates |
| **JCF** | Jamaica Constabulary Force | Police records, background checks |
| **BOJ** | Bank of Jamaica | Central bank, Jam-Dex CBDC issuer |
| **PICA** | Passport, Immigration and Citizenship Agency | Passports, immigration status |
