pragma solidity ^0.8.16;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

struct IdentityStoreEntry {
    uint256 blockId;
    string email;
    bytes32 proof;
    address publicAddress;
}

contract IdentityStore is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    IdentityStoreEntry[] private arr;
    address private oracle;
    string[] private usedJWTs;
    bytes32 private jobId;
    uint256 private fee;

    constructor(address _chainLinkToken, address _chainLinkOracle, bytes32 _jobId) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_chainLinkToken);
        setChainlinkOracle(_chainLinkOracle);
        jobId = _jobId;
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    function addIdentityStoreEntry(
        string memory _email,
        bytes32 _proof,
        address _publicAddress,
        string memory jwt,
        uint8 signature_v,
        bytes32 signature_r,
        bytes32 signature_s
    ) public returns (bytes32) {
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

        usedJWTs.push(jwt);
        // verify jwt here
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("email", _email);
        req.addBytes("proof", abi.encodePacked(_proof));
        req.addBytes("publicAddress", abi.encodePacked(_publicAddress));
        req.add("jwt", jwt);
        return sendChainlinkRequest(req, fee);
    }

    function fulfill(
        bytes32 _requestId,
        string memory _email,
        bytes32 _proof,
        address _publicAddress
    ) public recordChainlinkFulfillment(_requestId) {
        IdentityStoreEntry memory data;
        data.email = _email;
        data.proof = _proof;
        data.publicAddress = _publicAddress;
        data.blockId = block.number;
        arr.push(data);
    }

        function getEmailFromPublicAddress(address _publicAddress)
        public
        view
        returns (string memory)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i].publicAddress == _publicAddress) return arr[i].email;
        }
        return "";
    }
}
