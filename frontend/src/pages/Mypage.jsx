import React, { useEffect, useState } from 'react'
// nft 판매 정보 작성하는 컴포넌트
import axios from 'axios';
import TokenAdditionalInfo from '../components/TokenAdditionalInfo/TokenAdditionalInfo'

const Mypage = ({user, web3, contract}) => {
  const [registerList, setRegisterList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

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

    //
    const pendings = list[1].map((el,index)=>{
      return {...el, tokenId : parseInt(el.tokenId)}
    });
    console.log("pendings", pendings);
    setPendingList(pendings);
  }

  // 구매 nft 불러오는 함수
  const getBuyNFTList = async () => {
    const list = await contract.methods.getBuyNFTList().call({
      from : user.account
    });
    console.log("getBuyNFTList", list);

  }

  // 판매 수락
  const accept = async (id) => {
    const data = await contract.methods.accept(id).send({
      from : user.account
    });
    console.log("data", data);
  }




  useEffect(()=>{
    getRegisterNFT();
    getSaledNFTList();
    getBuyNFTList();
  }, []);

  return (
    <div>Mypage
      <div>
        <div>판매 - 수락 대기</div>
        {
          pendingList.length != 0 ?
          pendingList.map((el, index) => {
            return (
              <>
                {el.name}
                {el.tokenId}
                <button onClick={()=>{accept(el.tokenId)}}>수락</button>
              </>
            )
          })
          :
          <>없음</>
        }

        <div>등록한 정보</div>
        {
          registerList.length != 0 ?
          registerList.map((el, index)=>{
            return (
              <>
                <TokenAdditionalInfo key={index} el={el} user={user} web3={web3} contract={contract} />
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