import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-circom";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    // goerli: {},
    // sepolia: {},
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  circom: {
    inputBasePath: "./circuits",
    outputBasePath: "./circuits/output",
    ptau: "powersOfTau28_hez_final_16.ptau",
    circuits: [
      {
        name: "puzzle1",
        version: 2,
        circuit: "./puzzle1/puzzle1.circom",
        input: "./puzzle1/input.json",
        protocol: "plonk",
      },
      {
        name: "puzzle2",
        version: 2,
        circuit: "./puzzle2/puzzle2.circom",
        input: "./puzzle2/input.json",
        protocol: "plonk",
      },
      {
        name: "puzzle3",
        version: 2,
        circuit: "./puzzle3/puzzle3.circom",
        input: "./puzzle3/input.json",
        protocol: "plonk",
      },
    ],
  },
};

export default config;
