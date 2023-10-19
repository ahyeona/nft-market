import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { NftList } from '../components/TokenAdditionalInfo';

const List = ({ user, web3, contract }) => {
  const nav = useNavigate();
  const [saleList, setSaleList] = useState([]);

  const getSaleNFTList = async () => {
    const data = await contract.methods.getSaleNFTList().call();
    const list = await Promise.all(data.map(async (el, index) => {
      const reps = await axios.get(el.jsonUri);
      const { name, description, image, attributes } = reps.data;
      // 확인
      // const tokenId = web3.utils.toBigInt(el.tokenId);
      const tokenId = parseInt(el.tokenId);
      console.log("tokenId,", tokenId);
      const price = await web3.utils.fromWei(el.price, "ether");
      return { ...el, name, tokenId, price, description, image, ranking: attributes[0].value }
    }));
    setSaleList(list);

    console.log("list", list);
  }

  useEffect(() => {
    getSaleNFTList();
  }, []);

  return (
    <div>
      <h1>판매 목록</h1>
      {
        saleList.length != 0 ?
        <NftList list={saleList} />
          :
        <></>
      }

    </div>
  )
}

export default List