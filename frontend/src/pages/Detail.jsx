import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';

const Detail = ({ user, web3, contract }) => {
  const { id } = useParams();
  const [token, setToken] = useState(null);

  const getToken = async () => {
    const data = await contract.methods.getTokenReturned(id).call();
    console.log(data);
    const reps = await axios.get(data.jsonUri);
    console.log(reps);
    const { name, description, image, attributes } = reps.data;
    // 확인
    // const tokenId = web3.utils.toBigInt(data.tokenId);
    const tokenId = parseInt(data.tokenId);
    const price = await web3.utils.fromWei(data.price, "ether").toString(10);
    setToken({ ...data, name, tokenId, price, description, image, ranking: attributes[0].value });
  }

  // 구매 신쳥
  const buyNFT = async () => {
    console.log("Type of price:", typeof token.price.toString(10));
    const data = await contract.methods.buyNFT(id).send({
      from : user.account,
      value : await web3.utils.toWei(token.price, "ether").toString(10)
    });

    console.log(data);
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(()=>{
    console.log("token", token);
  }, [token]);

  return (
    <div>
      <div>{token.name}</div>
      <div>{token.tokenId}번</div>
      <div>{token.description}</div>
      <div>{token.ranking}</div>
      <div>{token.seller}</div>
      <div>{token.price}ETH</div>
      <img src={token.image} />

      {/* 확인. state */}
      {token.state == 1 ?
        <button onClick={buyNFT}>구매 신청</button>
        :
        <></>
      }
    </div>
  )
}

export default Detail