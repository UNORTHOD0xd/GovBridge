// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/DocVerify.sol";
import "../src/PaymentReceipt.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        DocVerify docVerify = new DocVerify();
        PaymentReceipt paymentReceipt = new PaymentReceipt();

        console.log("DocVerify deployed at:", address(docVerify));
        console.log("PaymentReceipt deployed at:", address(paymentReceipt));

        vm.stopBroadcast();
    }
}
