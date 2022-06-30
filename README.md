# ZK Puzzles

## Getting started

### Prerequisites

Be sure to have installed the following

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Clone the Repo

```shell
git clone https://github.com/andrejrakic/zk-puzzles.git
```

### Build and Deploy

1. Install packages

```shell
yarn
```

2. Compile contracts

```shell
yarn compile
```

3. Run tests

```shell
yarn test
```

> **Note**
>
> If you want to recompile circuits run

```shell
yarn circom
# or
yarn circom --circuit puzzleName
```

## The Game

To enter the game player needs to mint an Proof of Solved Puzzle (POSP) NFT via PuzzleFactory contract. No one can posses more than one POSP at the time.

Player solves puzzles level by level. To solve the puzzle player needs, using UI, to create a valid zk-proof and to pass it to the specific Puzzle Verifier smart contract via PuzzleFactory.

POSP is a dynamic NFT and it evolves with each solved puzzle.

<details>
<summary>Puzzle 1</summary>
What is the only positive integer solution of aᵇ=bᵃ, assuming that a≠b?
</details>

<details>
<summary>Puzzle 2</summary>
Find the values of A, B, C, and D?

A + A + A = 24

A + A - B = 80

B + C - B = 54

C + B \* A = D

</details>

<details>
<summary>Puzzle 3</summary>
Find the values of A, B, C, and D?
 <img src="https://user-images.githubusercontent.com/37881789/176679260-d5d6eadd-03f4-46c2-813f-3fab67da311a.png" />
</details>
