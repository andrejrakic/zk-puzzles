// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IPuzzleVerifier.sol";
import "./POSP.sol";

contract PuzzleFactory is Ownable {
    using Counters for Counters.Counter;

    POSP public posp;
    Counters.Counter private _levelCounter;

    mapping(uint256 => address) puzzleVerifiers;

    event NewLevelCreated(uint256 level);
    event NewPlayerJoined(address indexed player);
    event PuzzleSolved(address indexed player, uint256 indexed level);

    error PuzzleFactory__PlayerExists();
    error PuzzleFactory__NotOwner(address player);
    error PuzzleFactory__WrongSolution();
    error PuzzleFacotry__InvalidLevel();

    constructor() {
        posp = new POSP(address(this));
    }

    function addNewLevel(address verifierContract) public onlyOwner {
        puzzleVerifiers[_levelCounter.current()] = verifierContract;
        
        _levelCounter.increment();
        
        emit NewLevelCreated(_levelCounter.current());
    }

    function startGame() public {
        if(posp.balanceOf(msg.sender) > 0) {
            revert PuzzleFactory__PlayerExists();
        }
        
        posp.mint(msg.sender);
        
        emit NewPlayerJoined(msg.sender);
    }

    function solvePuzzle(
        uint256 tokenId,
        bytes memory proof,
        uint256[] memory pubSignals
    ) public {
        if(posp.ownerOf(tokenId) != msg.sender) {
            revert PuzzleFactory__NotOwner(msg.sender);
        }

        uint256 currentLevel = posp.getLevel(tokenId);
        address puzzle = puzzleVerifiers[currentLevel++];
        bool isSolved = IPuzzleVerifier(puzzle).verifyProof(proof, pubSignals);

        if(!isSolved) {
            revert PuzzleFactory__WrongSolution();
        }

        if(currentLevel < _levelCounter.current()) {
            posp.nextLevel(tokenId);
        }
        
        emit PuzzleSolved(msg.sender, currentLevel);
    }

    function verifySolution(
        uint256 level,
        bytes memory proof,
        uint256[] memory pubSignals
    ) public view returns (bool) {
        address puzzle = puzzleVerifiers[level];

        if(puzzle == address(0)) {
            revert PuzzleFacotry__InvalidLevel();
        }

        return IPuzzleVerifier(puzzle).verifyProof(proof, pubSignals);
    }
}
