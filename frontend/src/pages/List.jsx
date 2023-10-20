import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NftList } from '../components/TokenAdditionalInfo';
import axios from 'axios';

const List = ({ user, web3, contract }) => {
  const nav = useNavigate();
  const [rank1List, setRank1List] = useState([]);
  const [rank2List, setRank2List] = useState([]);
  const [rank3List, setRank3List] = useState([]);

  const getSaleNFTList = async () => {
    const data = await contract.methods.getSaleNFTList().call();
    const list1 = [];
    const list2 = [];
    const list3 = [];
    await Promise.all(data.map(async (el, index) => {
      const reps = await axios.get(el.jsonUri);
      const { attributes } = reps.data;
      switch (attributes[0].value) {
        case "under 10" :
          list1.push(el);
          break;
        case "under 20":
          list2.push(el);
          break;
        case "up 20":
          list3.push(el);
          break;
      }

      // // 확인
      // // const tokenId = web3.utils.toBigInt(el.tokenId);
      // const tokenId = parseInt(el.tokenId);
      // console.log("tokenId,", tokenId);
      // const price = await web3.utils.fromWei(el.price, "ether");
      // return { ...el, ranking: attributes[0].value }
    }));

    setRank1List(list1);
    setRank2List(list2);
    setRank3List(list3);
  }

  useEffect(() => {
    getSaleNFTList();
  }, []);

  return (
    <div>
      <h1>판매 목록</h1>

      <h3>under 10</h3>
      {
        rank1List.length != 0 ?
        <NftList list={rank1List} web3={web3} />
        :
        <></>
      }

      <h3>under 20</h3>
      {
        rank2List.length != 0 ?
        <NftList list={rank2List} web3={web3} />
        :
        <></>
      }


      <h3>up 20</h3>
      {
        rank3List.length != 0 ?
        <NftList list={rank3List} web3={web3} />
        :
        <></>
      }

    </div>
  )
}

export default List