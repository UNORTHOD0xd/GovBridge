// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DocVerify.sol";

contract DocVerifyTest is Test {
    DocVerify public dv;

    function setUp() public {
        dv = new DocVerify();
    }

    function test_anchorAndVerify() public {
        bytes32 docHash = keccak256("test-document-content");
        bytes32 ninHash = keccak256("100100100A");
        dv.anchorDocument(docHash, ninHash, "TAJ", "tax_compliance");

        (bool verified, string memory agency, , , ) = dv.verifyDocument(docHash);
        assertTrue(verified);
        assertEq(agency, "TAJ");
    }

    function test_rejectDuplicate() public {
        bytes32 docHash = keccak256("doc");
        dv.anchorDocument(docHash, bytes32(0), "TAJ", "tax_compliance");
        vm.expectRevert("already anchored");
        dv.anchorDocument(docHash, bytes32(0), "TAJ", "tax_compliance");
    }

    function test_rejectUnauthorized() public {
        vm.prank(address(0xdead));
        vm.expectRevert("not authorized agency");
        dv.anchorDocument(keccak256("x"), bytes32(0), "TAJ", "tax_compliance");
    }

    function test_revokeDocument() public {
        bytes32 docHash = keccak256("revoke-test");
        dv.anchorDocument(docHash, bytes32(0), "RGD", "birth_cert");
        assertTrue(dv.isValid(docHash));

        dv.revokeDocument(docHash);
        assertFalse(dv.isValid(docHash));
    }

    function test_totalDocuments() public {
        assertEq(dv.totalDocuments(), 0);
        dv.anchorDocument(keccak256("a"), bytes32(0), "TAJ", "tax_compliance");
        dv.anchorDocument(keccak256("b"), bytes32(0), "RGD", "birth_cert");
        assertEq(dv.totalDocuments(), 2);
    }
}
