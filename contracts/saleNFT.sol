// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./myNFT.sol";

contract SaleNFT {
    // 누가 판매 등록을 한 NFT들이 보여야 하니까
    // 판매 등록을 한 NFT의 매핑 객체를 만들든가?
    // 판매 금액이 얼마인지를 다루는 컨트랙트

    // 상호작용할 CA의 주소
    MyNFT public _nft;
    // CA 상호작용할 컨트랙트를 담을 상태변수

    // 확인 18에서 수정
    uint256 constant decimals = 15;

    // 판매 상태
    enum SaleState {
        NotForSale, // 등록 : 필요없을 것 같음. 확인
        ForSale, // 판매중
        Pending, // 구매신청
        Sold // 판매 완료
    }

    // 토큰 상태, 금액
    struct TokenSaleData {
        SaleState state;
        uint256 price;
        // 구매자? 확인
        address buyer;
    }

    // 반환할 토큰 형태
    struct TokenReturned {
        uint256 tokenId;
        string jsonUri;
        address seller;
        SaleState state;
        uint256 price;
        // 구매자? 확인
        address buyer;
    }

    uint256[] public tokenIds;

    // tokenId => TokenSaleData
    mapping(uint256 => TokenSaleData) public tokenSaleDatas;

    // 판매자 => tokenId
    mapping(address => uint256[]) public sellers;

    // // 구매자 => tokenId
    // mapping(address => uint256[]) public buyers;

    // 토큰 데이터
    struct TokenData {
        string jsonHash;
        uint256 volume;// 남은 발행량,
    }
    // mapping(string => uint256) private TokenData;

    // 매핑 이름 확인
    // 판매자 주소 => tokenData[]
    // mapping(address => mapping(string => uint256)[]) public tokenDatas;
    mapping(address => TokenData[]) public tokenDatas;

    constructor(address _nftCA) {
        _nft = MyNFT(_nftCA);
        // 상호작용할 CA 인스턴스 생성
    }

    // 토큰 등록
    // tokenDatas 설정
    function registerData(string memory jsonHash, uint256 volume) public {
        // TokenData[jsonHash] = volume;
        tokenDatas[msg.sender].push(TokenData(jsonHash, volume));
        setApprovalForAll();
    }

    // 토큰 발행
    // 판매 시작()
    function _saleNFTmint(string memory jsonHash, uint256 price) public {
        // require(TokenData[jsonHash] >= 1, "volume");
        // require(TokenData.jsonHash >= 1, "volume");
        uint256 length = tokenDatas[msg.sender].length;
        uint256 idx;
        for (uint256 i=0; i < length; i++) {
            if (keccak256(abi.encodePacked(tokenDatas[msg.sender][i].jsonHash)) == keccak256(abi.encodePacked(jsonHash))) {
                idx = i;
                break;
            }
        }

        require(tokenDatas[msg.sender][idx].volume >= 1, "volume");

        // CA에서 CA로 메시지 전송 메서드 실행
        uint256 tokenId = _nft.minting(jsonHash);

        tokenIds.push(tokenId);

        tokenSaleDatas[tokenId] = TokenSaleData(
            SaleState.ForSale,
            price * (10 ** decimals),
            address(0)
        );

        sellers[msg.sender].push(tokenId);

        salesNFT();

        // 토큰 발행량 감소
        // TokenData[jsonHash] -= 1;
        tokenDatas[msg.sender][idx].volume -= 1;
    }

    // 구매 신청
    function buyNFT(uint256 tokenId) public payable {
        // 해당 토큰이 거래 가능한 상태여야 함
        require(tokenSaleDatas[tokenId].state == SaleState.ForSale, "state");
        // 금액이 해당 토큰의 price 보다 적으면 안됨
        require(tokenSaleDatas[tokenId].price <= msg.value, "price");

        tokenSaleDatas[tokenId].buyer = msg.sender;
        tokenSaleDatas[tokenId].state = SaleState.Pending;
    }

    // 판매 확정
    // function accept(uint256 tokenId) public payable {
    function accept(uint256 tokenId) public {
        // 구매신청된 상태여야 함
        require(tokenSaleDatas[tokenId].state == SaleState.Pending, "state");

        // ca가 금액을 적게 가지고 있으면 안됨
        require(_nft.balanceOf(address(this)) <= tokenSaleDatas[tokenId].price);

        // nft 소유권 구매자에게 줌
        _nft.transferFrom(
            address(this),
            tokenSaleDatas[tokenId].buyer,
            tokenId
        );
        // 확인 이부분 추가 작성

        // address(this) 아니면 seller가 주는걸로
        // seller : _nft.ownerOf(tokenId);
        // _nft.transferFrom(address(this), tokenSaleDatas[tokenId].buyer, tokenId);

        tokenSaleDatas[tokenId].state = SaleState.Sold;

        // 판매자에게 상품 금액 보내기
        payable(_nft.ownerOf(tokenId)).transfer(tokenSaleDatas[tokenId].price);
    }

    // 랭킹 계산하는 함수
    function getRanking(uint256 volume) public pure returns (string memory) {
        if (volume <= 10) {
            return "under 10";
        } else if (volume <= 20) {
            return "under 20";
        } else {
            return "up 20";
        }
    }

    // 판매에 대한 내용의 함수 작성
    // saleNFT에서 myNFT 메시지를 보내서 NFT 권한을 위임받는 함수를 실행해보자
    function setApprovalForAll() public {
        // 판매 컨트랙트가 지금 컨트랙트를 실행시킨 사람의 NFT 모든 권한을 위임받았다.
        _nft.setAppAll(msg.sender, address(this), true);
    }

    // 실행시킨 사람이 판매 컨트랙트에게 NFT의 권한을 위임했는지 확인하는 함수
    function salesNFT() public view returns (bool) {
        return _nft.isApprovedForAll(msg.sender, address(this));
    }

    function getTokenReturned(uint256 tokenId) public view returns (TokenReturned memory) {
        return TokenReturned(tokenId, _nft.tokenURI(tokenId), _nft.ownerOf(tokenId), tokenSaleDatas[tokenId].state, tokenSaleDatas[tokenId].price, tokenSaleDatas[tokenId].buyer);
    }

    // 판매 가능한 nft 목록 출력
    function getSaleNFTList() public view returns (TokenReturned[] memory) {
        uint256 length = tokenIds.length;
        TokenReturned[] memory list = new TokenReturned[](length);
        uint256 count = 0;
        for (uint256 i = 0; i<length; i++) {
            if (tokenSaleDatas[tokenIds[i]].state == SaleState.ForSale) {
                // list[count] = TokenReturned(tokenIds[i], _nft.tokenURI(tokenIds[i]), _nft.ownerOf(tokenIds[i]), tokenSaleDatas[tokenIds[i]].state, tokenSaleDatas[tokenIds[i]].price, tokenSaleDatas[tokenIds[i]].buyer);
                list[count] = getTokenReturned(tokenIds[i]);
                count++;
            }
        }
        assembly {
            mstore(list, count)
        }
        return list;
    }

    // 판매중, 판매 완료된 nft 목록 반환
    function getSaledNFTList() public view returns (TokenReturned[] memory, TokenReturned[] memory, TokenReturned[] memory) {
        uint256 length = sellers[msg.sender].length;
        TokenReturned[] memory list = new TokenReturned[](length);
        TokenReturned[] memory list2 = new TokenReturned[](length);
        TokenReturned[] memory list3 = new TokenReturned[](length);
        uint256 count = 0;
        uint256 count2 = 0;
        uint256 count3 = 0;
        for (uint256 i = 0; i<length; i++) {
            if (tokenSaleDatas[sellers[msg.sender][i]].state == SaleState.ForSale) {
                list[count] = getTokenReturned(sellers[msg.sender][i]);
                count++;
            } else if (tokenSaleDatas[sellers[msg.sender][i]].state == SaleState.Pending) {
                list2[count2] = getTokenReturned(sellers[msg.sender][i]);
                count2++;
            } else if (tokenSaleDatas[sellers[msg.sender][i]].state == SaleState.Sold) {
                list3[count3] = getTokenReturned(sellers[msg.sender][i]);
                count3++;
            }
        }
        assembly {
            mstore(list, count)
            mstore(list2, count2)
            mstore(list3, count3)
        }
        return (list, list2, list3);
    }

    // 구매 신청, 구매 nft 목록
    function getBuyNFTList() public view returns (TokenReturned[] memory, TokenReturned[] memory) {
        uint256 length = tokenIds.length;
        TokenReturned[] memory list = new TokenReturned[](length);
        TokenReturned[] memory list2 = new TokenReturned[](length);
        uint256 count = 0;
        uint256 count2 = 0;
        for (uint256 i = 0; i<length; i++) {
            if (tokenSaleDatas[tokenIds[i]].state == SaleState.Pending && tokenSaleDatas[tokenIds[i]].buyer == msg.sender) {
                list[count] = getTokenReturned(tokenIds[i]);
                count++;
            } else if (tokenSaleDatas[tokenIds[i]].state == SaleState.Sold && tokenSaleDatas[tokenIds[i]].buyer == msg.sender) {
                list2[count2] = getTokenReturned(tokenIds[i]);
                count2++;
            }
        }
        assembly {
            mstore(list, count)
            mstore(list2, count2)

        }
        return (list, list2);
    }


    // 판매자가 등록한 nft의 내용 반환
    // // function getResisterNFT() public returns (string[] memory, uint256[] memory) {
    function getRegisterNFT() public view returns (TokenData[] memory) {
    //     // uint256 length = tokenDatas[msg.sender].length;
    //     // string[] memory hashArr = new string[](length);
    //     // uint256[] memory volumeArray = new uint256[](length);

    //     // for (uint256 i = 0; i < length; i++) {
    //     //     hashArr[i] = tokenDatas[msg.sender][i];
    //     //     volumeArray[i] = tokenDatas[msg.sender][tokenDatas[msg.sender][i]];
    //     // }

    //     // return (hashArr, volumeArray);
        return tokenDatas[msg.sender];
    }

    // 판매 내용
    // 누가 판매 등록했는지 담을 상태변수 등
    // 금액은 얼마로 설정했는지
    // 판매에 대한 시기
    // 구매자가 구매 의사를 표현하면서 구매 신청을 할 때 상품의 금액만큼 CA에 이더를 보낸다. (판매컨트랙트)
    // 판매자가 확인을 할 수 있고 판매 확인 버튼 누르면
    // CA에서 이더를 받고 소유권을 구매자에게 넘긴다.
    // 거래 끝
}
