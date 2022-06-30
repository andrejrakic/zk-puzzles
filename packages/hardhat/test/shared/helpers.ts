import {
  BigNumber,
  BytesLike,
  Contract,
  ContractFactory,
  Wallet,
} from "ethers";
import { ethers, snarkjs } from "hardhat";
import { PlonkProof } from "./types";

export const deploy = async (contractName: string, deployer: Wallet) => {
  const contractFactory: ContractFactory = await ethers.getContractFactory(
    contractName
  );

  const contract: Contract = await contractFactory.connect(deployer).deploy();

  await contract.deployed();

  return contract;
};

export const generatePlonkProof = async (
  _input: unknown,
  _wasmPath: string,
  _zkeyPath: string
): Promise<PlonkProof> => {
  const { proof, publicSignals } = await snarkjs.plonk.fullProve(
    _input,
    _wasmPath,
    _zkeyPath
  );

  const solidityCallData: string = await snarkjs.plonk.exportSolidityCallData(
    proof,
    publicSignals
  );

  const solidityCallDataArray = solidityCallData.split(",");

  const plonkProof: BytesLike = solidityCallDataArray[0] as BytesLike;
  const plonkPublicSignals: BigNumber[] = publicSignals as BigNumber[];

  return { plonkProof, plonkPublicSignals };
};
