pragma solidity ^0.8.16;
import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

struct IdentityStoreEntry {
    uint blockId;
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
    uint private fee;
    
    
   function addIdentityStoreEntry(string memory _email, bytes32 _proof, address _publicAddress, string memory jwt, uint8 signature_v, bytes32 signature_r, bytes32 signature_s) public returns (bytes32) {
        require(_proof.length > 0, "proof's length must be greater than 0");
        for (uint i = 0; i < arr.length; i++) {
            require(!(arr[i].proof == _proof
                && keccak256(bytes(arr[i].email)) == keccak256(bytes(_email))),
                "proofs cannot be reused"
            );
        }
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";


        bytes32 prefixedMessage = keccak256(abi.encodePacked(prefix, _proof));
        address signer = ecrecover(prefixedMessage, signature_v, signature_r, signature_s);
        require(signer == _publicAddress, "address from signature and _publicAddress do not match");
        usedJWTs.push(jwt);
        // verify jwt here
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add('email', _email);
        req.addBytes('proof', abi.encodePacked(_proof));
        req.addBytes('publicAddress', abi.encodePacked(_publicAddress));
        req.add('jwt', jwt);
        return sendChainlinkRequest(req, fee);
    }
    function getEmailFromPublicAddress(address _publicAddress) public view returns (string memory) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].publicAddress == _publicAddress) return arr[i].email;
        }
        return "";
    }
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0x8E5A56F915B56FCFdB8Cc7E881D68b0d72900014);
        jobId = '2b12a33373284ea686f848a020ca9a6e';
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }
    function fulfill(bytes32 _requestId, string memory _email, bytes32 _proof, address _publicAddress) public recordChainlinkFulfillment(_requestId) {
        IdentityStoreEntry memory data;
        data.email = _email;
        data.proof = _proof;
        data.publicAddress = _publicAddress;
        data.blockId = block.number;
        arr.push(data);
    }
}
