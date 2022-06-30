import { assert } from "chai";
import { BigNumber } from "ethers";
import { LabeledWitness } from "hardhat-circom";
import { generatePlonkProof } from "../shared/helpers";

export const shouldVerifyPuzzle3 = (): void => {
  const a = process.env.PUZZLE3_A !== undefined ? process.env.PUZZLE3_A : 0;
  const b = process.env.PUZZLE3_B !== undefined ? process.env.PUZZLE3_B : 0;
  const c = process.env.PUZZLE3_C !== undefined ? process.env.PUZZLE3_C : 0;
  const d = process.env.PUZZLE3_D !== undefined ? process.env.PUZZLE3_D : 0;

  const inputSignals = { a: a, b: b, c: c, d: d };
  const outputSignals = { res1: 2, res2: 10, res3: 6, res4: 8 };

  describe(`circuit`, async () => {
    const sanityCheck = true;

    it(`should produce a witness with valid constraints`, async function () {
      const witness: BigInt[] =
        await this.circuits.circuitPuzzle3.calculateWitness(
          inputSignals,
          sanityCheck
        );

      await this.circuits.circuitPuzzle3.checkConstraints(witness);
    });

    it(`should have expected witness values`, async function () {
      const witness: LabeledWitness =
        await this.circuits.circuitPuzzle3.calculateLabeledWitness(
          inputSignals,
          sanityCheck
        );

      assert.property(witness, `main.a`, undefined);
      assert.property(witness, `main.b`, undefined);
      assert.property(witness, `main.c`, undefined);
      assert.property(witness, `main.d`, undefined);
      assert.property(witness, `main.res1`, outputSignals.res1.toString());
      assert.property(witness, `main.res2`, outputSignals.res2.toString());
      assert.property(witness, `main.res3`, outputSignals.res3.toString());
      assert.property(witness, `main.res4`, outputSignals.res4.toString());
    });

    it(`should have correct output`, async function () {
      const witness = await this.circuits.circuitPuzzle3.calculateWitness(
        inputSignals,
        sanityCheck
      );

      await this.circuits.circuitPuzzle3.assertOut(witness, outputSignals);
    });
  });

  describe(`#verifyProof`, async () => {
    context(`with correct input`, async function () {
      it(`should verify proof`, async function () {
        const { plonkProof } = await generatePlonkProof(
          inputSignals,
          "circuits/output/puzzle3.wasm",
          "circuits/output/puzzle3.zkey"
        );

        const expectedOutputSignals: BigNumber[] = Object.values(
          outputSignals
        ).map((value) => BigNumber.from(value));

        const verification: boolean = await this.verifiers.puzzle3.verifyProof(
          plonkProof,
          expectedOutputSignals
        );

        assert(verification, "Verification failed, while it should succeed");
      });
    });

    context(`without correct input`, async function () {
      it(`should not verify proof`, async function () {
        const badInput = { a: 0, b: 0, c: 0, d: 0 };

        const expectedOutputSignals: BigNumber[] = Object.values(
          outputSignals
        ).map((value) => BigNumber.from(value));

        const { plonkProof } = await generatePlonkProof(
          badInput,
          "circuits/output/puzzle3.wasm",
          "circuits/output/puzzle3.zkey"
        );

        const verification: boolean = await this.verifiers.puzzle3.verifyProof(
          plonkProof,
          expectedOutputSignals
        );

        assert(!verification, "Verification succeded, while it should fail");
      });
    });

    context(`with compromised proof`, async function () {
      it(`should not verify proof`, async function () {
        const { plonkProof, plonkPublicSignals } = await generatePlonkProof(
          inputSignals,
          "circuits/output/puzzle3.wasm",
          "circuits/output/puzzle3.zkey"
        );

        const compromisedProof = plonkProof.toString().replace(/.$/, `f`);

        const expectedOutputSignals: BigNumber[] = Object.values(
          outputSignals
        ).map((value) => BigNumber.from(value));

        const verification: boolean = await this.verifiers.puzzle3.verifyProof(
          compromisedProof,
          expectedOutputSignals
        );

        assert(!verification, "Verification succeeded, while it should fail");
      });
    });
  });
};
