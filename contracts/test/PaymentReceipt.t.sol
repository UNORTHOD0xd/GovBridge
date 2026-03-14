// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PaymentReceipt.sol";

contract PaymentReceiptTest is Test {
    PaymentReceipt public pr;

    function setUp() public {
        pr = new PaymentReceipt();
    }

    function test_recordAndGetReceipt() public {
        bytes32 ninHash = keccak256("100100100A");
        bytes32 receiptId = pr.recordPayment(ninHash, 5000, "TAJ", "tax_compliance");

        (uint256 amount, string memory agency, string memory serviceType, , bool exists_) = pr.getReceipt(receiptId);
        assertTrue(exists_);
        assertEq(amount, 5000);
        assertEq(agency, "TAJ");
        assertEq(serviceType, "tax_compliance");
    }

    function test_rejectUnauthorized() public {
        vm.prank(address(0xdead));
        vm.expectRevert("not authorized");
        pr.recordPayment(bytes32(0), 1000, "TAJ", "tax_compliance");
    }

    function test_totalReceipts() public {
        assertEq(pr.totalReceipts(), 0);
        pr.recordPayment(keccak256("a"), 1000, "TAJ", "tax_compliance");
        pr.recordPayment(keccak256("b"), 2000, "RGD", "birth_cert");
        assertEq(pr.totalReceipts(), 2);
    }
}
