import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Btn } from '../components/utils/btn.styled';
import { BigImg } from '../components/utils/bigImg.styled';
import Modal from '../components/utils/modal/Modal';
import { Container, Content, ContentDiv, ImgDiv, TextDiv, Title } from '../components/utils/labelInputDiv.styled';

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
    console.log("state     ", data.state);
    setToken({ ...data, name, tokenId, price, description, image, ranking: attributes[0].value });
  }

  // 구매 신쳥
  const buyNFT = async () => {
    if (user.account.toLowerCase() == token.seller.toLowerCase()) return;
    setModal(true);
    const data = await contract.methods.buyNFT(id).send({
      from: user.account,
      value: await web3.utils.toWei(token.price, "ether").toString(10)
    });
    setModal(false);
    window.location.reload();
    console.log(data);
  }

  useEffect(() => {
    getToken();
  }, [user, web3]);

  useEffect(() => {
    if (token) {
      console.log("token", token);
      switch (parseInt(token.state)) {
        case 1:
          setState("판매 중");
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

  useEffect(() => {
    console.log("modal");
  }, [modal]);


  if (modal) {
    return <Modal setModal={setModal} title={title} content={content} />
  }

  return (
    <div>
      {
        token ?
          <>
            <Container>
              <ImgDiv>
                <BigImg src={token.image} />
              </ImgDiv>
              <TextDiv>
                <ContentDiv>
                  <Title>이름</Title><Content>{token.name}</Content>
                </ContentDiv>
                <ContentDiv>
                  <Title>랭킹</Title><Content>{token.ranking}</Content>
                </ContentDiv>
                <ContentDiv>
                  <Title>{state}</Title>
                </ContentDiv>
                <ContentDiv>
                  <Title>설명</Title><Content>{token.description}</Content>
                </ContentDiv>
                <ContentDiv>
                  <Title>가격</Title><Content>{token.price}ETH</Content>
                </ContentDiv>
                <ContentDiv>
                  <Title>판매자</Title><Content>{token.seller}</Content>
                </ContentDiv>

              </TextDiv>

              {/* 확인. state */}
              {(token && token?.state == 1 && token.seller.toLowerCase() != user.account.toLowerCase()) ?
                <Btn onClick={buyNFT}>구매 신청</Btn>
                :
                <></>
              }
            </Container>
          </>
          :
          <></>
      }

    </div>
  )
}

export default Detail