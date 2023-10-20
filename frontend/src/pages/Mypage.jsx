import React, { useEffect, useState } from 'react'
// nft 판매 정보 작성하는 컴포넌트
import axios from 'axios';
import TokenAdditionalInfo from '../components/TokenAdditionalInfo/TokenAdditionalInfo'
import { NftList } from '../components/TokenAdditionalInfo';
import Modal from '../components/utils/modal/Modal';

const Mypage = ({user, web3, contract}) => {
  const [registerList, setRegisterList] = useState([]);
  const [forSaleList, setForSaleList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [soldList, setSoldList] = useState([]);
  const [buyingNFTList, setBuyingNFTList] = useState([]);
  const [buyNFTList, setBuyNFTList] = useState([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("마이페이지");
  const [content, setContent] = useState("마이페이지");


  // 등록한 정보 불러오는 함수
  const getRegisterNFT = async () => {
    const data = await contract.methods.getRegisterNFT().call({
      from : user.account
    });

    const registers = await Promise.all(data.map(async (el)=>{
      const reps = await axios.get("https://apricot-wrong-platypus-336.mypinata.cloud/ipfs/"+el.jsonHash);
      const { name, description, image, attributes } = reps.data;
      return {...el, volume : parseInt(el.volume), name, description, image, ranking : attributes[0].value }
    }));

    setRegisterList(registers);
  }

  // 판매 중인 nft 불러오는 함수
  const getSaledNFTList = async () => {
    const list = await contract.methods.getSaledNFTList().call({
      from : user.account
    });
    console.log("getSaledNFTList", list);

    // const pendings = list[1].map((el,index)=>{
    //   return {...el, tokenId : parseInt(el.tokenId)}
    // });
    // console.log("pendings", pendings);
    
    // 판매중
    setForSaleList(list[0]);
    // 수락 대기중
    setPendingList(list[1]);
    // 판매 완료
    setSoldList(list[2]);
  }

  // 구매 nft 불러오는 함수
  const getBuyNFTList = async () => {
    const list = await contract.methods.getBuyNFTList().call({
      from : user.account
    });
    console.log("getBuyNFTList", list);

    // 구매 신청
    setBuyingNFTList(list[0]);
    // 구매 완료
    setBuyNFTList(list[1]);
  }

  // 판매 수락
  const accept = async (id) => {
    setTitle("지갑");
    setContent("신청 수락은 지갑에서 진행해주세요.");
    setModal(true);
    
    const data = await contract.methods.accept(id).send({
      from : user.account
    });
    console.log("data", data);
    setModal(false);
  }


  useEffect(()=>{
    getRegisterNFT();
    getSaledNFTList();
    getBuyNFTList();
  }, [user]);

  useEffect(()=>{
    if (modal) {
      document.body.style.overflow = "hidden";
      document.body.style.backgroundColor = "#444";
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
    return (
      <Modal setModal={setModal} title={title} content={content}/>
    )
  }


  return (
    <div>Mypage
      <div>
        <div>구매 중</div>
        {
          buyingNFTList.length != 0 ? 
          <NftList list={buyingNFTList} web3={web3} />
          :
          <></>
        }

        <div>구매 완료</div>
        {
          buyNFTList.length != 0 ? 
          <NftList list={buyNFTList} web3={web3} />
          :
          <></>
        }

        <div>판매 중</div>
        {
          forSaleList.length != 0 ?
          <NftList list={forSaleList} web3={web3} />
          :
          <>없음</>
        }

        <div>판매 - 수락 대기</div>
        {
          pendingList.length != 0 ?
          <NftList list={pendingList} web3={web3} clickFunc={accept} btnText={"수락"} />
          // pendingList.map((el, index) => {
          //   return (
          //     <>
          //       {el.name}
          //       {el.tokenId}
          //       <button onClick={()=>{accept(el.tokenId)}}>수락</button>
          //     </>
          //   )
          // })
          :
          <>없음</>
        }

        <div>판매 완료</div>
        {
          soldList.length != 0 ?
          <NftList list={soldList} web3={web3} />
          :
          <>없음</>
        }


        <div>등록한 정보</div>
        {
          registerList.length != 0 ?
          registerList.map((el, index)=>{
            return (
              <>
                <TokenAdditionalInfo key={index} el={el} user={user} web3={web3} contract={contract} setModal={setModal} setTitle={setTitle} setContent={setContent} />
              </>
            )
          })


          :
          <></>
        }
      </div>
    </div>
  )
}

export default Mypage