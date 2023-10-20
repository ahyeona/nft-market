import React from 'react'
import { NftDiv } from './nft.styled'

const Nft = ({ token, onClick }) => {

  return (
    <NftDiv onClick={onClick} style={{ backgroundColor: "aliceblue" }}>
      <h3>{token.name}</h3>
      <h3>{token.price}ETH</h3>
      <img src={token.image} />
    </NftDiv>
  )
}

export default Nft