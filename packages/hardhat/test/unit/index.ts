import { circuitTest, waffle } from "hardhat";
import { shouldVerifyPuzzle1 } from "./puzzle1.spec";
import { shouldVerifyPuzzle2 } from "./puzzle2.spec";
import { pospFixture, verifiersFixture } from "../shared/fixtures";
import { Circuits, Signers, Verfiers } from "../shared/types";
import { shouldDeployPOSP, shouldMint } from "./posp.spec";
import { shouldVerifyPuzzle3 } from "./puzzle3.spec";

describe(`Unit tests`, async () => {
  before(async function () {
    const wallets = waffle.provider.getWallets();

    this.signers = {} as Signers;
    this.signers.deployer = wallets[0];
    this.signers.prover = wallets[1];
    this.signers.alice = wallets[2];
    this.signers.bob = wallets[3];

    this.verifiers = {} as Verfiers;

    this.loadFixture = waffle.createFixtureLoader(wallets);

    this.circuits = {} as Circuits;

    this.circuits.circuitPuzzle1 = await circuitTest.setup(`puzzle1`);
    this.circuits.circuitPuzzle2 = await circuitTest.setup(`puzzle2`);
    this.circuits.circuitPuzzle3 = await circuitTest.setup(`puzzle3`);
  });

  describe(`POSP`, async () => {
    beforeEach(async function () {
      const { posp } = await this.loadFixture(pospFixture);
      this.posp = posp;
    });

    shouldDeployPOSP();
    shouldMint();
  });

  describe(`Puzzle 1`, async () => {
    beforeEach(async function () {
      const { puzzle1Verifier } = await this.loadFixture(verifiersFixture);

      this.verifiers.puzzle1 = puzzle1Verifier;
    });

    shouldVerifyPuzzle1();
  });

  describe(`Puzzle 2`, async () => {
    beforeEach(async function () {
      const { puzzle2Verifier } = await this.loadFixture(verifiersFixture);

      this.verifiers.puzzle2 = puzzle2Verifier;
    });

    shouldVerifyPuzzle2();
  });

  describe(`Puzzle 3`, async () => {
    beforeEach(async function () {
      const { puzzle3Verifier } = await this.loadFixture(verifiersFixture);

      this.verifiers.puzzle3 = puzzle3Verifier;
    });

    shouldVerifyPuzzle3();
  });
});
