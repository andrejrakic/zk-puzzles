import { assert } from "chai";
import { constants } from "ethers";
import { LabeledWitness } from "hardhat-circom";
import { generatePlonkProof } from "../shared/helpers";

export const shouldVerifyPuzzle1 = (): void => {
  const a = process.env.PUZZLE1_A !== undefined ? process.env.PUZZLE1_A : 0;
  const b = process.env.PUZZLE1_B !== undefined ? process.env.PUZZLE1_B : 0;

  const input = { a: a, b: b };

  describe(`circuit`, async () => {
    const sanityCheck = true;
    it(`should produce a witness with valid constraints`, async function () {
      const witness: BigInt[] =
        await this.circuits.circuitPuzzle1.calculateWitness(input, sanityCheck);

      await this.circuits.circuitPuzzle1.checkConstraints(witness);
    });

    it(`should have expected witness values`, async function () {
      const witness: LabeledWitness =
        await this.circuits.circuitPuzzle1.calculateLabeledWitness(
          input,
          sanityCheck
        );

      assert.property(witness, `main.a`, undefined);
      assert.property(witness, `main.b`, undefined);
      assert.property(witness, `main.result`, `0`);
    });

    it(`should have correct output`, async function () {
      const expectedOutputSignal = { result: constants.Zero };

      const witness = await this.circuits.circuitPuzzle1.calculateWitness(
        input,
        sanityCheck
      );

      await this.circuits.circuitPuzzle1.assertOut(
        witness,
        expectedOutputSignal
      );
    });
  });

  describe(`#verifyProof`, async () => {
    context(`with correct input`, async function () {
      it(`should verify proof`, async function () {
        const { plonkProof, plonkPublicSignals } = await generatePlonkProof(
          input,
          "circuits/output/puzzle1.wasm",
          "circuits/output/puzzle1.zkey"
        );

        const verification: boolean = await this.verifiers.puzzle1.verifyProof(
          plonkProof,
          plonkPublicSignals
        );

        assert(verification, "Verification failed, while it should succeed");
      });
    });

    context(`with compromised proof`, async function () {
      it(`shouldn't verify proof`, async function () {
        const { plonkProof, plonkPublicSignals } = await generatePlonkProof(
          input,
          "circuits/output/puzzle1.wasm",
          "circuits/output/puzzle1.zkey"
        );

        const compromisedProof = plonkProof.toString().replace(/.$/, `f`);

        const verification: boolean = await this.verifiers.puzzle1.verifyProof(
          compromisedProof,
          plonkPublicSignals
        );

        assert(!verification, "Verification succeeded, while it should fail");
      });
    });
  });
};
