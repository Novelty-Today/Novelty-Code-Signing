const contract  = "NoveltyNFT" // change contract here

async function main() {
    const MyContract = await ethers.getContractFactory(contract) // global variable ethers from hardhat library
    const myContract = await MyContract.deploy() // Start deployment, returning a promise that resolves to a contract object
    // await myContract.deployed()
    console.log("Contract deployed to address:", myContract.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('error', error)
      process.exit(1)
    })
  