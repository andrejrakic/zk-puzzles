// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPuzzleVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals)
        external
        view
        returns (bool);
}
