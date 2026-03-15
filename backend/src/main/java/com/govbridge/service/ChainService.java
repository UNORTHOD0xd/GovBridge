package com.govbridge.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.List;

@Service
public class ChainService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final String docVerifyAddress;
    private final String paymentReceiptAddress;

    public ChainService(
        @Value("${govbridge.chain.rpc-url}") String rpcUrl,
        @Value("${govbridge.chain.private-key:}") String privateKey,
        @Value("${govbridge.chain.doc-verify-address:}") String docVerifyAddr,
        @Value("${govbridge.chain.payment-receipt-address:}") String paymentReceiptAddr
    ) {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        Credentials creds = null;
        if (privateKey != null && !privateKey.isBlank() && !privateKey.equals("none")) {
            try {
                creds = Credentials.create(privateKey);
            } catch (Exception e) {
                // Invalid key — chain writes will be disabled
            }
        }
        this.credentials = creds;
        this.docVerifyAddress = docVerifyAddr;
        this.paymentReceiptAddress = paymentReceiptAddr;
    }

    public String anchorDocument(String docHash, String ninHash, String agency, String docType)
        throws Exception
    {
        var function = new Function(
            "anchorDocument",
            List.of(
                new Bytes32(hexToBytes32(docHash)),
                new Bytes32(hexToBytes32(ninHash)),
                new Utf8String(agency),
                new Utf8String(docType)
            ),
            List.of()
        );
        return sendTransaction(docVerifyAddress, function);
    }

    public record PaymentResult(String txHash, String receiptId) {}

    public PaymentResult recordPayment(String ninHash, long amount, String agency, String serviceType)
        throws Exception
    {
        var function = new Function(
            "recordPayment",
            List.of(
                new Bytes32(hexToBytes32(ninHash)),
                new Uint256(BigInteger.valueOf(amount)),
                new Utf8String(agency),
                new Utf8String(serviceType)
            ),
            List.of(new TypeReference<Bytes32>() {})
        );
        String txHash = sendTransaction(paymentReceiptAddress, function);
        String receiptId = "0x" + txHash.substring(2, 66);
        return new PaymentResult(txHash, receiptId);
    }

    private String sendTransaction(String contractAddress, Function function) throws Exception {
        if (credentials == null) {
            throw new RuntimeException("No deployer private key configured");
        }

        String encodedFunction = FunctionEncoder.encode(function);
        var nonce = web3j.ethGetTransactionCount(
            credentials.getAddress(), DefaultBlockParameterName.PENDING
        ).send().getTransactionCount();

        var tx = RawTransaction.createTransaction(
            nonce,
            BigInteger.valueOf(1_000_000_000L),
            BigInteger.valueOf(500_000L),
            contractAddress,
            encodedFunction
        );

        byte[] signed = TransactionEncoder.signMessage(tx, 84532L, credentials);
        String hexValue = Numeric.toHexString(signed);
        var response = web3j.ethSendRawTransaction(hexValue).send();

        if (response.hasError()) {
            throw new RuntimeException("Transaction failed: " + response.getError().getMessage());
        }
        return response.getTransactionHash();
    }

    private byte[] hexToBytes32(String hex) {
        String clean = hex.startsWith("0x") ? hex.substring(2) : hex;
        clean = String.format("%64s", clean).replace(' ', '0');
        return Numeric.hexStringToByteArray(clean);
    }
}
