const hre = require("hardhat");

async function main() {
  // The contract address (replace this with your deployed contract address)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get the contract factory and attach the deployed contract
  const AgriVerify = await hre.ethers.getContractFactory("AgriVerify");
  const agriVerify = await AgriVerify.attach(contractAddress);

  // Fetch the deployer's address
  const [deployer] = await hre.ethers.getSigners();

  console.log("Interacting with contract at:", agriVerify.address);

  // Step 1: Certify a new crop
  const name = "Organic Apple";
  const farmLocation = "Green Valley Farms";

  const tx = await agriVerify.certifyCrop(name, farmLocation);
  await tx.wait();

  console.log(`Certified new crop: ${name} from ${farmLocation}`);

  // Step 2: Fetch the details of the certified crop (assuming it is the first crop)
  const cropId = 1; // Adjust if you're certifying multiple crops
  const crop = await agriVerify.getCrop(cropId);

  console.log(`Crop Details (ID ${cropId}):`);
  console.log(`Name: ${crop[0]}`);
  console.log(`Farm Location: ${crop[1]}`);
  console.log(`Certifier: ${crop[2]}`);
  console.log(`Certified: ${crop[3]}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
