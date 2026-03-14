// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DocVerify {
    struct DocRecord {
        bytes32 ninHash;
        string agency;
        string docType;
        uint256 issuedAt;
        address issuer;
        bool revoked;
    }

    mapping(bytes32 => DocRecord) private _records;
    mapping(bytes32 => bool) private _exists;
    bytes32[] private _allHashes;
    mapping(address => bool) public authorizedAgencies;
    address public owner;

    event DocumentAnchored(
        bytes32 indexed docHash,
        bytes32 indexed ninHash,
        string agency,
        string docType,
        uint256 issuedAt,
        address issuer
    );
    event DocumentRevoked(bytes32 indexed docHash, uint256 revokedAt);
    event AgencyAuthorized(address indexed agency);
    event AgencyRevoked(address indexed agency);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedAgencies[msg.sender], "not authorized agency");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedAgencies[msg.sender] = true;
    }

    function anchorDocument(
        bytes32 docHash,
        bytes32 ninHash,
        string calldata agency,
        string calldata docType
    ) external onlyAuthorized {
        require(docHash != bytes32(0), "empty hash");
        require(!_exists[docHash], "already anchored");

        _records[docHash] = DocRecord({
            ninHash: ninHash,
            agency: agency,
            docType: docType,
            issuedAt: block.timestamp,
            issuer: msg.sender,
            revoked: false
        });
        _exists[docHash] = true;
        _allHashes.push(docHash);

        emit DocumentAnchored(docHash, ninHash, agency, docType, block.timestamp, msg.sender);
    }

    function verifyDocument(bytes32 docHash)
        external
        view
        returns (
            bool verified,
            string memory agency,
            string memory docType,
            uint256 issuedAt,
            bool revoked
        )
    {
        if (!_exists[docHash]) return (false, "", "", 0, false);
        DocRecord storage r = _records[docHash];
        return (true, r.agency, r.docType, r.issuedAt, r.revoked);
    }

    function revokeDocument(bytes32 docHash) external onlyAuthorized {
        require(_exists[docHash], "not found");
        require(_records[docHash].issuer == msg.sender, "not issuer");
        require(!_records[docHash].revoked, "already revoked");
        _records[docHash].revoked = true;
        emit DocumentRevoked(docHash, block.timestamp);
    }

    function authorizeAgency(address agency) external onlyOwner {
        authorizedAgencies[agency] = true;
        emit AgencyAuthorized(agency);
    }

    function revokeAgency(address agency) external onlyOwner {
        authorizedAgencies[agency] = false;
        emit AgencyRevoked(agency);
    }

    function isValid(bytes32 docHash) external view returns (bool) {
        return _exists[docHash] && !_records[docHash].revoked;
    }

    function totalDocuments() external view returns (uint256) {
        return _allHashes.length;
    }
}
