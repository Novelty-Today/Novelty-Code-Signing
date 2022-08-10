import os
import sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
import novelty_code_sign.novelty_code_sign as code_sign

tokenURI = code_sign.getTokenURI('1')
print(tokenURI)
