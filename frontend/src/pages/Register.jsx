import React, { useEffect, useState } from 'react'
import axios from "axios";
import { pinata_api_key, pinata_secret_api_key } from "../api";
import { Input } from '../components/utils/input.styled';
import { labelInputDiv, Container, TextDiv, ImgDiv } from '../components/utils/labelInputDiv.styled';
import { BigImg } from '../components/utils/bigImg.styled';
import { Btn } from '../components/utils/btn.styled';
import Modal from '../components/utils/modal/Modal';
import { useNavigate } from 'react-router-dom';

// nft 내용 등록 페이지
const Register = ({ user, web3, contract }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [volume, setVolume] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("등록");
  const [content, setContent] = useState("등록 중 입니다.");

  const nav = useNavigate();

  const upload = async () => {
    if (name == "" || description == "" || volume <= 0 || !Number.isInteger(parseInt(volume)) || !image) {
      alert("모든 값을 입력하세요.");
      return;
    }

    setModal(true);

    // 랭킹 받아오기
    const ranking = await contract.methods.getRanking(volume).call();
    console.log("ranking", ranking);

    // 이미지 업로드
    const imgData = new FormData();
    imgData.append("file", image);
    const imgResp = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", imgData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key,
          pinata_secret_api_key
        }
      });

    console.log(imgResp);
    console.log(imgResp.data.IpfsHash);

    // json 파일 업로드
    const jsonFile = JSON.stringify({
      "name": name,
      "description": description,
      "image": "https://apricot-wrong-platypus-336.mypinata.cloud/ipfs/" + imgResp.data.IpfsHash,
      "attributes": [{
        "trait_type": "Ranking",
        "value": ranking
      }]
    });

    const jsonData = new FormData();
    const blob = new Blob([jsonFile], { type: 'application/json' });
    jsonData.append("file", blob);

    const jsonResp = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", jsonData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key,
          pinata_secret_api_key
        }
      });

    console.log("resp2 : ", jsonResp.data);
    console.log("resp2 IpfsHash : ", jsonResp.data.IpfsHash);

    setModal(false);

    setTitle("지갑 ");
    setContent("지갑에서 진행해주세요.");

    setModal(true);

    const register = await contract.methods.registerData(jsonResp.data.IpfsHash, volume).send({
      from: user.account
    });
    
    
    console.log("register : ", register);
    setModal(false);
    alert("등록 완료");
    window.location.reload();

  }

  const loadImg = (e) => {
    const file = e.target.files[0];
    if (file == null) {
      setImage(null);
      setImageUrl(null);
    } else {
      setImage(file);
      setImageUrl(URL.createObjectURL(file)); 
    }
  }


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
    <div>
      <h2>등록</h2>
      <Container>
          <label>이미지</label>
        <ImgDiv>
          <div>
            <BigImg src = {imageUrl} alt="이미지를 선택하세요." />
            <input type="file" onChange={(e) => { loadImg(e) }} />
          </div>
        </ImgDiv>
        <TextDiv>
        <div>
          <label>이름</label>
          <Input type="text" onChange={(e) => { setName(e.target.value.trim()) }} />
        </div>
        <div>
          <label>설명</label>
          <Input type="text" onChange={(e) => { setDescription(e.target.value.trim()) }} />
        </div>
        <div>
          <label>발행량</label>
          <Input type="text" onChange={(e) => { setVolume(e.target.value.trim()) }} />
        </div>
        </TextDiv>

        <Btn onClick={upload}>등록</Btn>
      </Container>
    </div>
  )
}

export default Register