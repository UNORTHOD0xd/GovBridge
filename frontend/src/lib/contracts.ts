import { ethers } from "ethers";

export const BASE_SEPOLIA = {
  chainId: 84532,
  rpcUrl: "https://base-sepolia.infura.io/v3/935a9f7050ae4a26aeaa9077407991c3",
  explorer: "https://sepolia.basescan.org",
};

const DOC_VERIFY_ABI = [
  "function verifyDocument(bytes32 docHash) view returns (bool verified, string agency, string docType, uint256 issuedAt, bool revoked)",
  "function isValid(bytes32 docHash) view returns (bool)",
  "function totalDocuments() view returns (uint256)",
];

const PAYMENT_RECEIPT_ABI = [
  "function getReceipt(bytes32 receiptId) view returns (uint256 amount, string agency, string serviceType, uint256 timestamp, bool exists_)",
  "function totalReceipts() view returns (uint256)",
];

function provider() {
  return new ethers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);
}

export async function verifyDocument(docHash: string) {
  const addr = import.meta.env.VITE_DOC_VERIFY_ADDRESS;
  if (!addr) return { verified: false, agency: "", docType: "", issuedAt: 0, revoked: false };

  const contract = new ethers.Contract(addr, DOC_VERIFY_ABI, provider());
  const hash = docHash.startsWith("0x") ? docHash : `0x${docHash}`;
  const [verified, agency, docType, issuedAt, revoked] = await contract.verifyDocument(hash);
  return {
    verified,
    agency,
    docType,
    issuedAt: Number(issuedAt),
    revoked,
  };
}

export async function getReceipt(receiptId: string) {
  const addr = import.meta.env.VITE_PAYMENT_RECEIPT_ADDRESS;
  if (!addr) return null;

  const contract = new ethers.Contract(addr, PAYMENT_RECEIPT_ABI, provider());
  const [amount, agency, serviceType, timestamp, exists] = await contract.getReceipt(receiptId);
  if (!exists) return null;
  return { amount: Number(amount), agency, serviceType, timestamp: Number(timestamp) };
}

export function explorerTxUrl(txHash: string) {
  return `${BASE_SEPOLIA.explorer}/tx/${txHash}`;
}

export function explorerAddressUrl(address: string) {
  return `${BASE_SEPOLIA.explorer}/address/${address}`;
}
