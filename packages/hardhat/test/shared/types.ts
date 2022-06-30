import { Fixture } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";
import {
  POSP,
  Puzzle1Verifier,
  Puzzle2Verifier,
  PuzzleFactory,
} from "../../typechain";
import { BytesLike, BigNumber } from "ethers";
import { CircuitTestUtils } from "hardhat-circom";
import { Puzzle3Verifier } from "../../typechain/Puzzle3Verifier";

declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    verifiers: Verfiers;
    circuits: Circuits;
    posp: POSP;
    puzzleFactory: PuzzleFactory;
  }
}

export interface Signers {
  deployer: Wallet;
  prover: Wallet;
  alice: Wallet;
  bob: Wallet;
}

export interface Verfiers {
  puzzle1: Puzzle1Verifier;
  puzzle2: Puzzle2Verifier;
  puzzle3: Puzzle3Verifier;
}

export interface Circuits {
  circuitPuzzle1: CircuitTestUtils;
  circuitPuzzle2: CircuitTestUtils;
  circuitPuzzle3: CircuitTestUtils;
}

export interface PlonkProof {
  plonkProof: BytesLike;
  plonkPublicSignals: BigNumber[];
}
