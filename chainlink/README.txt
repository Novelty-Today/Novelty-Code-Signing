1) Build and deploy verifierServer and chainlink node.
in this folder chainlink related data is stored.
this includes a docker-compose.yaml file which is for running both the node and verifierServer.
docker-compose up will build and pull the appropriate images and run both the chainlink node as well as verfierServer.
note that docker-compose up will NOT rebuild images. if you made any changes to the Dockerfile in this folder or if you changed anything in verifierServer folder you will need to stop running instances (using CTRL+C in the terminal session where docker-compose is running) and run docker-compose build && docker-compose up.
to open chainlink UI, visit http://localhost:6688/
default username for chainlink node: user@example.com
default password for chainlink node: PA@SSword1234!567
2) Deposit Eth and LINK
This chainlink node will run on goerli testnet and will have it's own ethereum address, you will have to deposit GoerliEth and link to this address.
note that this is not optional, if you do not do this the chainlink node will fail to communicate with any oracle you deploy.
you can get goerli ETH at https://goerlifaucet.com
you can get testnet LINK by following this tutorial https://docs.chain.link/docs/acquire-link/
make sure to deposit more than 0.15 GoerliEth.

3) Add bridge to chainlink node
go to http://localhost:6688/ and login.
after logging in go to bridges.
add bridge with name verifier and with url http://verifier:4040/verifyJWT
you can leave every other option as is.

4) Deploying contracts and adding job to chainlink node
edit constants.json in this folder, make sure to change LINK_NODE_ADDRESS to your chainlink node's eth address.
run yarn deploy-contracts.
this script will deploy the oracle contract first.
after oracle contract is deployed the script will ask you for jobId, to get the jobId you will need to add job to chainlink node. the config file will be already copied, you just need to go to jobs in chainlink webui, paste it, add it and paste the jobId into the script.
after this the IdentityStore contract will be deployed and it's address will be printed alongside other information. you will need to deposit LINK to the contracts address for it to work.
the contract needs 0.1 LINK for each request it sends to the oracle.

you can interact with the contract by running the backend (the back/ folder, not verifierServer) and making calls with the python library.
note that having jobs in  "suspended" state is normal, it means that chainlink is submitting a transaction, it should change to "complete" within 10-20 minutes, if it doesn't, deposit more goerliEth and LINK to the node's address.

