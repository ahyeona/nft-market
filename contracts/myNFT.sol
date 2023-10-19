// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

// NFT에 관련된 코드 작성
contract MyNFT is ERC721 {
    uint256 tokenId = 0;

    // tokenId => jsonHash
    mapping(uint256 => string) private tokens;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function minting(string memory jsonHash, address sender) public returns (uint256) {
        tokens[tokenId] = jsonHash;

        // NFT의 소유권 및 권한 설정
        // owner, _tokenApprovals, _operatorApprovals 확인
        // _mint(msg.sender, tokenId);
        _mint(sender, tokenId);
        tokenId += 1;
        return tokenId - 1;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return string.concat(_baseURI(), tokens[_tokenId]);
        // return tokens[_tokenId];
    }

    function _baseURI() internal view override returns (string memory) {
        return "https://apricot-wrong-platypus-336.mypinata.cloud/ipfs/";
    }

    // NFT의 판매 권한을 줄 함수
    function setAppAll(address owner, address operator, bool approved) public {
        _setApprovalForAll(owner, operator, approved);
    }

}
