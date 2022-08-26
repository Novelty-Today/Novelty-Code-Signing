in this folder chainlink related data is stored.
note that for this to work, you will need to build verifierServer's docker image and tag it.
cd ../verifierServer/
sudo docker build -t verifier .

to deploy chainlink node run:
sudo docker-compose up
in this folder.
this should deploy verifier, chainlink and postgres.
to stop deployment of chainlink, press Ctrl+C.
to redeploy it, cd into this folder and and run docker-compose again in the same way.
do not use docker start manually.
If you want your changes to verifierServer to be applied to the container, stop the server, build the image and rerun docker-compose.
to open chainlink UI, visit http://localhost:6688/
default username for chainlink node: user@example.com
default password for chainlink node: PA@SSword1234!567
This chainlink node will run on goerli testnet and will have it's own ethereum address, you will have to deposit GoerliEth and link to this address.
you can get goerli ETH at https://goerlifaucet.com
you can get testnet LINK by following this tutorial https://docs.chain.link/docs/acquire-link/

after you have done this you will need to deploy oracle for the contracts to work.
you can deploy an oracle by following this tutorial
https://docs.chain.link/docs/fulfilling-requests/ (instructions about deploying oracle are before "add job to node chapter")
make sure to use goerli testnet.

in chainlink node ui, go to bridges,
create bridge with name "verifier" and url http://verifier:4040/verifyJWT
go to jobs, create a new jobs with the contents of job.toml, make sure that you replace multiple occurances of 0x8E5A56F915B56FCFdB8Cc7E881D68b0d72900014 with your oracle's address
after adding the job, you will get a jobId,
open IdentityStore.sol with remix.
replace 0x8E5A56F915B56FCFdB8Cc7E881D68b0d72900014 with your oracles address.
replace jobId with the jobId you got from chainlink, make sure to remove the dashes(-).
after you have done this, you should be able to use IdentityStore contract
