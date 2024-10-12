import React, { useState, useEffect } from "react";
// Import everything
import { ethers } from "ethers";

// Import just a few select items
import { BrowserProvider, parseUnits } from "ethers";

// Import from a specific export
import { HDNodeWallet } from "ethers/wallet";
import AgriVerify from "../../artifacts/contracts/AgriVerify.sol/AgriVerify.json"; // ABI file generated for the contract

const AgriVerifyComponent = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [cropName, setCropName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [cropId, setCropId] = useState("");
  const [cropDetails, setCropDetails] = useState(null);
  const [message, setMessage] = useState("");

  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your deployed contract address

  // Connect to Ethereum provider (MetaMask)
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        let signer = null;

        let provider;
        if (window.ethereum == null) {
          // If MetaMask is not installed, we use the default provider,
          // which is backed by a variety of third-party services (such
          // as INFURA). They do not have private keys installed,
          // so they only have read-only access
          console.log("MetaMask not installed; using read-only defaults");
          provider = ethers.getDefaultProvider();
        } else {
          // Connect to the MetaMask EIP-1193 object. This is a standard
          // protocol that allows Ethers access to make all read-only
          // requests through MetaMask.
          provider = new ethers.BrowserProvider(window.ethereum);

          // It also provides an opportunity to request access to write
          // operations, which will be performed by the private key
          // that MetaMask manages for the user.
          setSigner(await provider.getSigner());
          const c = new ethers.Contract(
            contractAddress,
            AgriVerify.abi,
            signer
          );
          console.log(c);

          setContract(c);
        }
      } else {
        setMessage("Please install MetaMask!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to wallet");
    }
  };

  // Certify a new crop (only owner can call this)
  const certifyCrop = async () => {
    if (!contract) {
      setMessage("Please connect to the wallet");
      return;
    }

    try {
      const tx = await contract.certifyCrop(cropName, farmLocation);
      await tx.wait(); // Wait for the transaction to be mined
      setMessage("Crop certified successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error certifying crop");
    }
  };

  // Get crop details by ID
  const fetchCropDetails = async () => {
    if (!contract) {
      setMessage("Please connect to the wallet");
      return;
    }

    try {
      const crop = await contract.getCrop(cropId);
      setCropDetails(crop);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching crop details");
    }
  };

  return (
    <div>
      <h1>AgriVerify - Crop Certification</h1>

      <button onClick={connectWallet}>Connect Wallet</button>
      {signer != undefined ? (
        <p>Connected as: {contract.target}</p>
      ) : (
        <p>Not connected</p>
      )}

      <div>
        <h2>Certify a Crop</h2>
        <input
          type="text"
          placeholder="Crop Name"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Farm Location"
          value={farmLocation}
          onChange={(e) => setFarmLocation(e.target.value)}
        />
        <button onClick={certifyCrop}>Certify Crop</button>
      </div>

      <div>
        <h2>Get Crop Details</h2>
        <input
          type="number"
          placeholder="Crop ID"
          value={cropId}
          onChange={(e) => setCropId(e.target.value)}
        />
        <button onClick={fetchCropDetails}>Fetch Crop</button>

        {cropDetails && (
          <div>
            <p>Crop Name: {cropDetails[0]}</p>
            <p>Farm Location: {cropDetails[1]}</p>
            <p>Certifier: {cropDetails[2]}</p>
            <p>Is Certified: {cropDetails[3] ? "Yes" : "No"}</p>
          </div>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AgriVerifyComponent;
