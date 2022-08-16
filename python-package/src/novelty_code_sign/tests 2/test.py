import os
import sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)


# importing private key
import json
private_key = json.load(open('keys.json'))["private_key"]
public_key = json.load(open('keys.json'))["public_key"]

from web3.auto import w3;
from novelty_code_sign import sign
from novelty_code_sign import verify


# advanced_sign( file,'0x{}'.format(private_key))

import shutil

def zip_folder(folder_path):
    shutil.make_archive('my_file','zip',folder_path)

print(parentdir)
zip_folder(parentdir)
