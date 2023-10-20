import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Btn } from '../components/utils/btn.styled';
import { BigImg } from '../components/utils/bigImg.styled';
import Modal from '../components/utils/modal/Modal';

const Detail = ({ user, web3, contract }) => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [state, setState] = useState(null);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("지갑");
  const [content, setContent] = useState("구매 신청은 지갑에서 진행해주세요.");

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
    console.log("state     ",data.state);
    setToken({ ...data, name, tokenId, price, description, image, ranking: attributes[0].value });
  }

  // 구매 신쳥
  const buyNFT = async () => {
    if (user.account.toLowerCase() == token.seller.toLowerCase()) return;
    setModal(true);
    const data = await contract.methods.buyNFT(id).send({
      from : user.account,
      value : await web3.utils.toWei(token.price, "ether").toString(10)
    });
    setModal(false);
    window.location.reload();
    console.log(data);
  }

  useEffect(() => {
    getToken();
  }, [user, web3]);

  useEffect(()=>{
    if (token) {
      console.log("token", token);
      switch (parseInt(token.state)) {
        case 1:
          setState("구매 가능");
          break;
        case 2:
            setState("거래 중");
            break;
        case 3:
          setState("판매 완료");
          break;
      }
    }
  }, [token]);

  useEffect(()=>{
    const navElement = document.querySelector("#nav");

    if (modal) {
      document.body.style.overflow = "hidden";
      document.body.style.backgroundColor = "#444";
      document.body.style.zIndex = -10;

      // document.querySelector("#nav").style.overflow = "hidden";
      // document.querySelector("#nav").style.backgroundColor = "#444";

      // return (
      //   <Modal setModal={setModal} />
      // )
    } else {
      document.body.style.overflow = "visible";
      document.body.style.backgroundColor = "white";
      // document.querySelector("#nav").style.overflow = "visible";
      // document.querySelector("#nav").style.backgroundColor = "white";

    }


  }, [modal]);


  if (modal) {
    return <Modal setModal={setModal} title={title} content={content}/>
  }

  return (
    <div>
      {
        token ?
        <>
          <div>{token.name}</div>
          <div>{token.tokenId}번</div>
          <div>{token.description}</div>
          <div>{token.ranking}</div>
          <div>{token.seller}</div>
          <div>{token.price}ETH</div>
          <div>{state}</div>
          <BigImg src={token.image} />

        </>
        :
        <></>
      }

      {/* 확인. state */}
      {(token && token?.state == 1 && token.seller.toLowerCase() != user.account.toLowerCase()) ?
        <Btn onClick={buyNFT}>구매 신청</Btn>
        :
        <></>
      }
    </div>
  )
}

export default Detail