#!/usr/bin/env python3
from novelty_code_sign import verify as novelty_verify;
from novelty_code_sign import sign as novelty_sign;
import json;

file = open("./keys.json", "r");
data = json.load(file);
private_key = "0x{}".format(data["private_key"]);
print("Private key loaded from ./keys.json");
print("Started signing ./test_file.txt");
verification_key = novelty_sign.easy_sign(file_path="./test_file.txt", filename="Test file", private_key=private_key)["tokenId"];

print("Successfully signed ./test_file.txt");
print("Verification key: {}".format(verification_key));

print("Verification Started");
result = novelty_verify.easy_verify(file_path="./test_file.txt", token_id=verification_key);
if (result):
    print("Successfully Verified ./test_file.txt");
else:
    print("Failed to verify ./test_file.txt");
