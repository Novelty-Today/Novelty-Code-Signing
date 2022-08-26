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
default username for chainlink node: user@example.com
default password for chainlink node: PA@SSword1234!567
