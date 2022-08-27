1) Build server as docker
in this folder chainlink related data is stored.
note that for this to work, you will need to build verifierServer's docker image and tag it.
cd ../verifierServer/
sudo docker build -t verifier .

2) Deploy chianlink node
to deploy chainlink node run:
sudo docker-compose up
in this folder.
this should deploy verifier, chainlink and postgres.
If you want your changes to verifierServer to be applied to the container, stop the server, build the image and rerun docker-compose.
to open chainlink UI, visit http://localhost:6688/
default username for chainlink node: user@example.com
default password for chainlink node: PA@SSword1234!567

(optional - deposit eth on link node)
This chainlink node will run on goerli testnet and will have it's own ethereum address, you will have to deposit GoerliEth and link to this address.
you can get goerli ETH at https://goerlifaucet.com
you can get testnet LINK by following this tutorial https://docs.chain.link/docs/acquire-link/

3) Deploy Oracle
after you have done this you will need to deploy oracle for the contracts to work.
to deploy oracle:
open https://remix.ethereum.org/#url=https://docs.chain.link/samples/NodeOperators/Oracle.sol in your webbrowser.
from the deployment drop down menu: select Oracle.
deploy the oracle using 0.6.6 solidity compiler on geoerli testnet.
after deployment, go to your chainlink node ui and copy the address.
call setFulfulmentPermisons on oracle contract with the address you copied as the first parameter and true as the second parameter, if you skip this step than chainlink node will silently fail.
you can read more about this topic from official documentation:
https://docs.chain.link/docs/fulfilling-requests/

4) Creating Bridge, Job in Link Node
in chainlink node ui, go to bridges,
create bridge with name "verifier" and url http://verifier:4040/verifyJWT
go to jobs, create a new jobs with the contents of job.toml, make sure that you replace multiple occurances of 0x8E5A56F915B56FCFdB8Cc7E881D68b0d72900014 with your oracle's address
after adding the job, you will get a jobId,
open IdentityStore.sol with remix.
replace 0x8E5A56F915B56FCFdB8Cc7E881D68b0d72900014 with your oracles address.
replace jobId with the jobId you got from chainlink, make sure to remove the dashes(-).
after you have done this, you should be able to use IdentityStore contract
