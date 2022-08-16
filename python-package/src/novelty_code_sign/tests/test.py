#!/usr/bin/env python3
from novelty_code_sign import verify as novelty_verify;
from novelty_code_sign import sign as novelty_sign;
from novelty_code_sign import common as novelty_common;
import json;
file = open("./keys.json", "r");
data = json.load(file);
private_key = "0x{}".format(data["private_key"]);
print("Started signing ./test_file.txt");
ipfs_uri, verification_key = novelty_sign.easy_sign(file_path="./test_file.txt", filename="Test file", private_key=private_key, pinata_jwt=data["pinata_jwt"]);
print("Successfully signed");

print("IPFS URI of file: {}".format(ipfs_uri));
print("Verification key: {}".format(verification_key));

print("Verification Started");
result = novelty_verify.easy_verify(ipfs_uri=ipfs_uri, token_id=verification_key);
if (result):
    print("Successfully Verified");
else:
    print("Failed to verify");
novelty_common.upload_file_to_pinata(filename="a", file_path="./test_file.txt", pinata_jwt=data["pinata_jwt"]);
