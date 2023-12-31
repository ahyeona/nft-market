import React, { useEffect, useState } from 'react'
import { Nft } from "../../components";
import { useNavigate } from 'react-router-dom'
import { NftListDiv } from './nftList.styled';
import axios from 'axios';
import { Btn } from '../utils/btn.styled';

const NftList = ({ list, web3, clickFunc=false, btnText, clickNone=false }) => {
    const nav = useNavigate();
    const [nfts, setNfts] = useState([]);
    let onClick;
    if (!clickNone) {
        onClick = (tokenId) => { nav(`/detail/${tokenId}`) };
    } else {
        onClick = ()=>{};
    }

    const setList = async () => {
        if (nfts.length == 0) {
            const data = await Promise.all(list.map(async (el, index) => {
              const reps = await axios.get(el.jsonUri);
              const { name, description, image, attributes } = reps.data;
              // 확인
              // const tokenId = web3.utils.toBigInt(el.tokenId);
              const tokenId = parseInt(el.tokenId);
              console.log("tokenId,", tokenId);
              const price = await web3.utils.fromWei(el.price, "ether");
              return { ...el, name, tokenId, price, description, image, ranking: attributes[0].value }
            }));

            setNfts(data);
        }
    }

    useEffect(()=>{
        setList();
    }, [list]);

    if (clickFunc) {
        return (
            <NftListDiv>
            {nfts.map((el, index) => {
                return (
                    // <>
                    // <Nft token={el} onClick={(e) => { nav(`/detail/${el.tokenId}`) }}>
                    //     <Btn onClick={()=>{clickFunc(el.tokenId)}}>{btnText}</Btn>
                    // </Nft>
                    // </>

                    <>
                    <Nft token={el} onClick={()=>{onClick(el.tokenId)}} btnFunc={clickFunc} btnText={btnText} />
                    {/* <Btn onClick={()=>{clickFunc(el.tokenId)}}>{btnText}</Btn> */}
                    </>
                )
            })}
            </NftListDiv>
        )
    } else {
        return (
            <NftListDiv>
            {nfts.map((el, index) => {
                return (
                    <>
                    <Nft token={el} onClick={()=>{onClick(el.tokenId)}} />
                    </>
                )
            })}
            </NftListDiv>
        )
    }
}

export default NftList