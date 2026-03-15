# GovBridge

A unified platform for Jamaican government services — integrating national identity (NIDS/JDXP), digital payments (Jam-Dex), and on-chain document verification.

Built for the Intellibus 2026 Hackathon.

## Live Demo

> **Important:** Use `http://`, not `https://`. The app does not have an SSL certificate, so browsers that auto-upgrade to HTTPS will fail to load.

**http://a404aa65cf71b48d7952b7278743894a-57111434.us-east-2.elb.amazonaws.com**

### Demo Credentials (NINs)

| NIN         | Name              | Parish    |
|-------------|-------------------|-----------|
| 100100100   | Marcus Thompson   | Kingston  |
| 100200200   | Aisha Campbell    | St. Andrew|
| 100300300   | Devon Williams    | St. James |

## Tech Stack

- **Backend:** Spring Boot 3.4, Java 21, PostgreSQL, Kafka, Web3j
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, ethers.js
- **Blockchain:** Solidity 0.8.24, Base Sepolia (L2)
- **Infrastructure:** AWS EKS, RDS, ECR, Terraform
