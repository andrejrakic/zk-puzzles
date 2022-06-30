import { Fixture } from "ethereum-waffle";
import { Contract, ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  POSP,
  Puzzle1Verifier,
  Puzzle2Verifier,
  PuzzleFactory,
} from "../../typechain";
import { Puzzle3Verifier } from "../../typechain/Puzzle3Verifier";
import { deploy } from "./helpers";

type VerifiersFixtureType = {
  puzzle1Verifier: Puzzle1Verifier;
  puzzle2Verifier: Puzzle2Verifier;
  puzzle3Verifier: Puzzle3Verifier;
};

export const verifiersFixture: Fixture<VerifiersFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];

  const puzzle1Verifier = (await deploy(
    `Puzzle1Verifier`,
    deployer
  )) as Puzzle1Verifier;

  const puzzle2Verifier = (await deploy(
    `Puzzle2Verifier`,
    deployer
  )) as Puzzle2Verifier;

  const puzzle3Verifier = (await deploy(
    `Puzzle3Verifier`,
    deployer
  )) as Puzzle3Verifier;

  return { puzzle1Verifier, puzzle2Verifier, puzzle3Verifier };
};

type POSPFixtureType = {
  posp: POSP;
};

export const pospFixture: Fixture<POSPFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];
  const mockPuzzleFactoryAddress: string = deployer.address;

  const pospFactory: ContractFactory = await ethers.getContractFactory(`POSP`);

  const posp = (await pospFactory
    .connect(deployer)
    .deploy(mockPuzzleFactoryAddress)) as POSP;

  await posp.deployed();

  return { posp };
};

type PuzzleFactoryFixtureType = {
  puzzleFactory: PuzzleFactory;
};

export const puzzleFactoryFixture: Fixture<PuzzleFactoryFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];
  const puzzleFactory = (await deploy(
    `PuzzleFactory`,
    deployer
  )) as PuzzleFactory;
  return { puzzleFactory };
};
