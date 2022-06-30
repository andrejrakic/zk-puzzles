import { assert, expect } from "chai";
import { BigNumber, constants } from "ethers";
import { LabeledWitness } from "hardhat-circom";
import { generatePlonkProof } from "../shared/helpers";

export const shouldVerifyPuzzle2 = (): void => {
  const a = process.env.PUZZLE2_A !== undefined ? process.env.PUZZLE2_A : 0;
  const b = process.env.PUZZLE2_B !== undefined ? process.env.PUZZLE2_B : 0;
  const c = process.env.PUZZLE2_C !== undefined ? process.env.PUZZLE2_C : 0;
  const d = process.env.PUZZLE2_D !== undefined ? process.env.PUZZLE2_D : 0;

  const inputSignals = { a: a, b: b, c: c, d: d };
  const outputSignal = { result: constants.Zero };

  describe(`circuit`, async () => {
    const sanityCheck = true;

    it(`should produce a witness with valid constraints`, async function () {
      const witness: BigInt[] =
        await this.circuits.circuitPuzzle2.calculateWitness(
          inputSignals,
          sanityCheck
        );

      await this.circuits.circuitPuzzle2.checkConstraints(witness);
    });

    it(`should have expected witness values`, async function () {
      const witness: LabeledWitness =
        await this.circuits.circuitPuzzle2.calculateLabeledWitness(
          inputSignals,
          sanityCheck
        );

      assert.property(witness, `main.a`, undefined);
      assert.property(witness, `main.b`, undefined);
      assert.property(witness, `main.c`, undefined);
      assert.property(witness, `main.d`, undefined);
      assert.property(witness, `main.result`, outputSignal.result.toString());
    });

    it(`should have correct output`, async function () {
      const witness = await this.circuits.circuitPuzzle2.calculateWitness(
        inputSignals,
        sanityCheck
      );

      await this.circuits.circuitPuzzle2.assertOut(witness, outputSignal);
    });
  });

  describe(`#verifyProof`, async () => {
    context(`with correct input`, async function () {
      it(`should verify proof`, async function () {
        const { plonkProof, plonkPublicSignals } = await generatePlonkProof(
          inputSignals,
          "circuits/output/puzzle2.wasm",
          "circuits/output/puzzle2.zkey"
        );

        const expectedOutputSignal: BigNumber[] = Object.values(
          outputSignal
        ).map((value) => BigNumber.from(value));

        const verification: boolean = await this.verifiers.puzzle2.verifyProof(
          plonkProof,
          expectedOutputSignal
        );

        assert(verification, "Verification failed, while it should succeed");
      });

      it(`should calculate expected output signals`, async function () {
        const { plonkPublicSignals } = await generatePlonkProof(
          inputSignals,
          "circuits/output/puzzle2.wasm",
          "circuits/output/puzzle2.zkey"
        );

        const expectedOutputSignal: BigNumber[] = Object.values(
          outputSignal
        ).map((value) => BigNumber.from(value));

        assert(
          expectedOutputSignal[0].eq(plonkPublicSignals[0]),
          "Calculated output signal is not equal with the expected one, while it should be"
        );
      });
    });

    context(`without correct input`, async function () {
      it.skip(`should revert calculating witness`, async function () {
        const badInput = { a: 0, b: 0, c: 0, d: 0 };
        const sanityCheck = true;

        let error;
        try {
          await this.circuits.circuitPuzzle2.calculateWitness(
            badInput,
            sanityCheck
          );
        } catch (err) {
          error = err;
        }

        expect(error).to.be.an(`Error`);
      });
    });

    context(`with compromised proof`, async function () {
      it(`shouldn't verify proof`, async function () {
        const { plonkProof } = await generatePlonkProof(
          inputSignals,
          "circuits/output/puzzle2.wasm",
          "circuits/output/puzzle2.zkey"
        );

        const compromisedProof = plonkProof.toString().replace(/.$/, `f`);

        const expectedOutputSignal: BigNumber[] = Object.values(
          outputSignal
        ).map((value) => BigNumber.from(value));

        const verification: boolean = await this.verifiers.puzzle2.verifyProof(
          compromisedProof,
          expectedOutputSignal
        );

        assert(!verification, "Verification succeeded, while it should fail");
      });
    });
  });
};
