// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PaymentReceipt {
    struct Receipt {
        bytes32 ninHash;
        uint256 amount;
        string agency;
        string serviceType;
        uint256 timestamp;
    }

    mapping(bytes32 => Receipt) private _receipts;
    mapping(bytes32 => bool) private _exists;
    bytes32[] public allReceiptIds;
    address public owner;
    mapping(address => bool) public authorizedCallers;

    event PaymentRecorded(
        bytes32 indexed receiptId,
        bytes32 indexed ninHash,
        uint256 amount,
        string agency,
        string serviceType,
        uint256 timestamp
    );

    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender], "not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedCallers[msg.sender] = true;
    }

    function recordPayment(
        bytes32 ninHash,
        uint256 amount,
        string calldata agency,
        string calldata serviceType
    ) external onlyAuthorized returns (bytes32 receiptId) {
        receiptId = keccak256(abi.encodePacked(ninHash, amount, agency, block.timestamp, allReceiptIds.length));
        require(!_exists[receiptId], "duplicate receipt");

        _receipts[receiptId] = Receipt({
            ninHash: ninHash,
            amount: amount,
            agency: agency,
            serviceType: serviceType,
            timestamp: block.timestamp
        });
        _exists[receiptId] = true;
        allReceiptIds.push(receiptId);

        emit PaymentRecorded(receiptId, ninHash, amount, agency, serviceType, block.timestamp);
    }

    function getReceipt(bytes32 receiptId)
        external
        view
        returns (uint256 amount, string memory agency, string memory serviceType, uint256 timestamp, bool exists_)
    {
        if (!_exists[receiptId]) return (0, "", "", 0, false);
        Receipt storage r = _receipts[receiptId];
        return (r.amount, r.agency, r.serviceType, r.timestamp, true);
    }

    function authorizeCaller(address caller) external {
        require(msg.sender == owner, "not owner");
        authorizedCallers[caller] = true;
    }

    function totalReceipts() external view returns (uint256) {
        return allReceiptIds.length;
    }
}
