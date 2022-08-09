import requests
def addSignature(filename, signature, timestamp, userAddress):
    postData = {'filename': filename, 'signature': signature, 'timestamp': timestamp, 'userAddress': userAddress}
    req = requests.post('http://localhost:8080/addSignature', json=postData);
    return req.json();
def getTokenURI(tokenId):
    req = requests.get('http://localhost:8080/getTokenURI/{}'.format(tokenId));
    return req.json();
def getDataFromTokenURI(tokenURI, gateway="https://dweb.link"):
    ipfsHash = tokenURI.replace("ipfs://", "");
    req = requests.get("{}/ipfs/{}".format(gateway, ipfsHash));
    return req.json();
