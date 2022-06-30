import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
import { abi as PUZZLE_VERIFIER_ABI } from "../../artifacts/contracts/Puzzle1Verifier.sol/Puzzle1Verifier.json";
import { abi as POSP_ABI } from "../../artifacts/contracts/POSP.sol/POSP.json";

export async function deployMockPuzzle(
  deployer: Signer
): Promise<MockContract> {
  const puzzleVerifier: MockContract = await waffle.deployMockContract(
    deployer,
    PUZZLE_VERIFIER_ABI
  );

  await puzzleVerifier.mock.verifyProof.returns(true);

  return puzzleVerifier;
}

export async function deployMockPOSP(deployer: Signer): Promise<MockContract> {
  const POSP: MockContract = await waffle.deployMockContract(
    deployer,
    POSP_ABI
  );

  return POSP;
}
