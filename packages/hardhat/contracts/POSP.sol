// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract POSP is ERC721URIStorage {
    using Counters for Counters.Counter;

    address private immutable i_factory;
    Counters.Counter private _tokenIdCounter;

    // tokenId => level
    mapping(uint256 => uint8) private playerLevel;

    event TokenMinted(uint256 indexed tokenId, address indexed player);
    event NewLevel(uint256 indexed tokenId, uint256 indexed level);

    error POSP__OnlyFactoryCanCall();

    modifier onlyFactory() {
        if (msg.sender != i_factory) {
            revert POSP__OnlyFactoryCanCall();
        }
        _;
    }

    constructor(address factory) ERC721("Proof of Solved Puzzle", "POSP") {
        i_factory = factory;
    }

    function mint(address player) external onlyFactory {
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(player, tokenId);
        //  slicica sa IPFS-a hardkodirana, npr drvo koje se grana
        // _setTokenURI(tokenId, "ipfs://qmistasdf");

        _tokenIdCounter.increment();

        emit TokenMinted(tokenId, player);
    }

    function nextLevel(uint256 tokenId) external onlyFactory {
        uint8 currentLevel = getLevel(tokenId);

        // _setTokenURI(tokenId, "ipfs://qmistasdf");

        playerLevel[tokenId] = currentLevel++;

        emit NewLevel(tokenId, currentLevel++);
    }

    function getFactory() public view returns (address) {
        return i_factory;
    }

    function getLevel(uint256 tokenId) public view returns (uint8) {
        return playerLevel[tokenId];
    }
}
