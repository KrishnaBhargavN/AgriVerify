// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriVerify {
    struct Crop {
        string name;
        string farmLocation;
        address certifier; // Address type for the certifier
        bool isCertified;
    }

    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    address public owner;

    event CropCertified(uint256 cropId, string name, string farmLocation, address certifier);

    // Constructor to set the deployer as the owner
    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Function to certify a crop, restricted to the owner
    function certifyCrop(string memory _name, string memory _farmLocation) public returns (uint256) {
        cropCount++;
        crops[cropCount] = Crop(_name, _farmLocation, msg.sender, true);

        emit CropCertified(cropCount, _name, _farmLocation, msg.sender);
        return cropCount;
    }

    // Function to retrieve crop details
    function getCrop(uint256 _cropId) public view returns (string memory, string memory, address, bool) {
        Crop memory crop = crops[_cropId];
        return (crop.name, crop.farmLocation, crop.certifier, crop.isCertified);
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }
}
