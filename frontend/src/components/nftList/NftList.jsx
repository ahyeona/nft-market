import React from 'react'
import { Nft } from "../TokenAdditionalInfo/index";
import { useNavigate } from 'react-router-dom'
import { NftListDiv } from './nftList.styled';

const NftList = ({ list }) => {
    const nav = useNavigate();

    return (
        <NftListDiv>
            {list.map((el, index) => {
                return (
                    <Nft token={el} onClick={(e) => { nav(`/detail/${el.tokenId}`) }} />
                )
            })}
        </NftListDiv>
    )
}

export default NftList