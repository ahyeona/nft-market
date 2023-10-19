import React from 'react'
import { NftDiv } from './nft.styled'

const Nft = ({ token, onClick }) => {

  return (
    <NftDiv onClick={onClick} style={{ backgroundColor: "aliceblue" }}>
      <div>{token.name}</div>
      <div>{token.price}ETH</div>
      <img src={token.image} />
    </NftDiv>
  )
}

export default Nft