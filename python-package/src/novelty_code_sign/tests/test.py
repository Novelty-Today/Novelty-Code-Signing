import os
import sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)


# importing private key
import json
private_key = json.load(open('keys.json'))["private_key"]

from web3.auto import w3;
import novelty_code_sign.novelty_code_sign as code_sign

file = w3.toBytes(text = "dffd") 
print("file",file)
sign = code_sign.advanced_sign( file,'0x{}'.format(private_key))
print("sign",sign)
