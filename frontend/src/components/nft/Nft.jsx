import React from 'react'
import { NftDiv } from './nft.styled'
import { Btn } from '../utils/btn.styled'

const Nft = ({ token, onClick=false, btnFunc=false, btnText=false }) => {

  return (
    <NftDiv onClick={onClick} style={{ backgroundColor: "aliceblue" }}>
      <h3>{token.name}</h3>
      <h3>{token.price}ETH</h3>
      <img src={token.image} />
      {btnFunc ? <Btn onClick={()=>{btnFunc(token.tokenId)}}>{btnText}</Btn> : <></>}
    </NftDiv>
  )
}

export default Nft