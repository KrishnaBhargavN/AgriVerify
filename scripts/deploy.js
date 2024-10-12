const hre = require("hardhat");

async function main() {
  // Fetch the deployer's address
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the contract factory for AgriVerify
  const AgriVerify = await hre.ethers.getContractFactory("AgriVerify");

  // Deploy the contract
  const agriVerify = await AgriVerify.deploy();

  // Wait for deployment to complete
  await agriVerify.deployed();

  console.log("AgriVerify deployed to:", agriVerify.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
