import { assert, expect } from "chai";
import { BigNumber, constants } from "ethers";

export const shouldDeployPOSP = (): void => {
  describe(`#constructor`, async function () {
    it(`should deploy POSP with correct PuzzleFactory address`, async function () {
      const mockPuzzleFactoryAddress: string = this.signers.deployer.address;
      const factory = await this.posp.getFactory();
      assert(
        factory === mockPuzzleFactoryAddress,
        `PuzzleFactory address missmatch`
      );
    });

    it(`should deploy POSP with correct name`, async function () {
      const expectedName: string = `Proof of Solved Puzzle`;
      const actualName: string = await this.posp.name();
      assert(expectedName === actualName, `Name missmatch`);
    });

    it(`should deploy POSP with correct ticker`, async function () {
      const expectedTicker: string = `POSP`;
      const actualTicker: string = await this.posp.symbol();
      assert(expectedTicker === actualTicker, `Ticker missmatch`);
    });
  });
};

export const shouldMint = (): void => {
  describe(`#mint`, async function () {
    context(`when puzzleFactory is calling`, async function () {
      it(`should mint new token`, async function () {
        await this.posp.mint(this.signers.alice.address);
        const aliceBalance: BigNumber = await this.posp.balanceOf(
          this.signers.alice.address
        );
        assert(aliceBalance.eq(constants.One), "Alice's Balance should be 1");
      });

      it(`should emit proper event`, async function () {
        await expect(this.posp.mint(this.signers.alice.address))
          .to.emit(this.posp, `TokenMinted`)
          .withArgs(constants.Zero, this.signers.alice.address);
      });

      it(`player's level should be zero`, async function () {
        await this.posp.mint(this.signers.alice.address);
        const level = await this.posp.getLevel(constants.Zero);
        assert(
          level === 0,
          "Values in playerLevel mapping should be zero by default"
        );
      });

      it(`should increment token ids by one`, async function () {
        await this.posp.mint(this.signers.alice.address);
        await this.posp.mint(this.signers.bob.address);
        assert(
          (await this.posp.ownerOf(constants.Zero)) ===
            this.signers.alice.address,
          "Alice should own firstly minted POSP"
        );
        assert(
          (await this.posp.ownerOf(constants.One)) === this.signers.bob.address,
          "Bob should own secondly minted POSP"
        );
      });
    });

    context(`when puzzleFactory is not calling`, async function () {
      it(`should revert`, async function () {
        await expect(
          this.posp.connect(this.signers.alice).mint(this.signers.alice.address)
        ).to.be.revertedWith(`POSP__OnlyFactoryCanCall()`);
      });
    });
  });
};
