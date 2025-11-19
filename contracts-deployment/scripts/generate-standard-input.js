const fs = require("fs");
const path = require("path");

// Read the OracleUpgradeable contract source
const contractSource = fs.readFileSync(
  path.join(__dirname, "../contracts/OracleProxy.sol"),
  "utf8"
);

// Create the Standard Input JSON format
const standardInput = {
  language: "Solidity",
  sources: {
    "contracts/OracleProxy.sol": {
      content: contractSource,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    evmVersion: "paris",
    outputSelection: {
      "*": {
        "*": [
          "abi",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
        ],
      },
    },
  },
};

// Write the Standard Input JSON file
fs.writeFileSync(
  path.join(__dirname, "../OracleProxy.standard-input.json"),
  JSON.stringify(standardInput, null, 2)
);

console.log("Standard Input JSON file generated: standard-input.json");
