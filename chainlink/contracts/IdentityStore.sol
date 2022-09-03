pragma solidity ^0.8.16;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

struct IdentityStoreEntry {
    uint256 blockId;
    string email;
    bytes32 proof;
    address publicAddress;
    bytes32[] approvals;
}

contract IdentityStore is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    IdentityStoreEntry[] private arr;
    string[] private usedJWTs;
    bytes32 private jobId;
    uint256 private fee;

    address chainLinkOracle1;
    bytes32 jobId1;
    address chainLinkOracle2;
    bytes32 jobId2;
    address chainLinkOracle3;
    bytes32 jobId3;

    constructor(address _chainLinkToken, address _chainLinkOracle1, bytes32 _jobId1, address _chainLinkOracle2, bytes32 _jobId2, address _chainLinkOracle3, bytes32 _jobId3) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_chainLinkToken);
        chainLinkOracle1 = _chainLinkOracle1;
        jobId1 = _jobId1;
        chainLinkOracle2 = _chainLinkOracle2;
        jobId2 = _jobId2;
        chainLinkOracle3 = _chainLinkOracle3;
        jobId3 = _jobId3;
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    function buildReq(
        bytes32 _jobId,
        string memory _email,
        bytes32 _proof,
        address _publicAddress,
        string memory jwt
    ) view internal returns (Chainlink.Request memory) {

        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("email", _email);
        req.addBytes("proof", abi.encodePacked(_proof));
        req.addBytes("publicAddress", abi.encodePacked(_publicAddress));
        req.add("jwt", jwt);
        return req;
    }

    function addIdentityStoreEntry(
        string memory _email,
        bytes32 _proof,
        address _publicAddress,
        string memory jwt,
        uint8 signature_v,
        bytes32 signature_r,
        bytes32 signature_s
    ) public {
        require(_proof.length > 0, "proof's length must be greater than 0");
        for (uint256 i = 0; i < arr.length; i++) {
            require(
                !(arr[i].proof == _proof &&
                    keccak256(bytes(arr[i].email)) == keccak256(bytes(_email))),
                "proofs cannot be reused"
            );
        }
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";

        bytes32 prefixedMessage = keccak256(abi.encodePacked(prefix, _proof));
        address signer = ecrecover(
            prefixedMessage,
            signature_v,
            signature_r,
            signature_s
        );
        require(
            signer == _publicAddress,
            "address from signature and _publicAddress do not match"
        );

        for (uint256 i = 0; i < usedJWTs.length; i++) {
            require(keccak256(bytes(usedJWTs[i])) != keccak256(bytes(jwt)), "JWT cannot be reused");
        }

        usedJWTs.push(jwt);
        // verify jwt here
        Chainlink.Request memory req1 = buildReq(jobId1, _email, _proof, _publicAddress, jwt);
        sendChainlinkRequestTo(chainLinkOracle1, req1, fee);
        Chainlink.Request memory req2 = buildReq(jobId2, _email, _proof, _publicAddress, jwt);
        sendChainlinkRequestTo(chainLinkOracle2, req2, fee);
        Chainlink.Request memory req3 = buildReq(jobId3, _email, _proof, _publicAddress, jwt);
        sendChainlinkRequestTo(chainLinkOracle3, req3, fee);
    }

    function fulfill(
        bytes32 _requestId,
        string memory _email,
        bytes32 _proof,
        address _publicAddress
    ) public recordChainlinkFulfillment(_requestId) {
        if (_publicAddress != address(0)) {
            IdentityStoreEntry memory data;
            data.email = _email;
            data.proof = _proof;
            data.publicAddress = _publicAddress;
            data.blockId = block.number;
            uint256 index = arr.length;
            for (uint256 i = 0; i < arr.length; i++) {
                if (keccak256(bytes(arr[i].email)) == keccak256(bytes(data.email))
                    && (keccak256(abi.encodePacked(arr[i].proof)) == keccak256(abi.encodePacked(data.proof)))
                    && (keccak256(abi.encodePacked(arr[i].publicAddress)) == keccak256(abi.encodePacked(data.publicAddress)))
                   ) {
                    index = i;
                    break;
                }
            }
            if (index == arr.length) {
                arr.push(data);
            }
            bool approvedAlready = false;
            for (uint256 i = 0; i < arr[index].approvals.length; i++) {
                if (arr[index].approvals[i] == _requestId) {
                    approvedAlready = true;
                }
            }
            if (!approvedAlready) {
                arr[index].approvals.push(_requestId);
            }
        }
    }

    function getEmailFromPublicAddress(address _publicAddress)
    public
    view
    returns (string memory)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[arr.length - 1 - i].publicAddress == _publicAddress && arr[arr.length - 1 - i].approvals.length >= 2) return arr[i].email;
        }
        return "";
    }
}
