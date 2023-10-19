import React, { useState } from 'react'
import axios from "axios";
import { pinata_api_key, pinata_secret_api_key } from "../api";

// nft 내용 등록 페이지
const Register = ({ user, web3, contract }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [volume, setVolume] = useState(0);
  const [image, setImage] = useState(null);

  const upload = async () => {
    if (name == "" || description == "" || volume <= 0 || !Number.isInteger(parseInt(volume)) || !image) {
      alert("모든 값을 입력하세요.");
      return;
    }

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

    const register = await contract.methods.registerData(jsonResp.data.IpfsHash, volume).send({
      from: user.account
    });

    console.log("register : ", register);


  }


  return (
    <div>
      등록
      <label>이름</label>
      <input type="text" onChange={(e) => { setName(e.target.value.trim()) }} />
      <label>설명</label>
      <input type="text" onChange={(e) => { setDescription(e.target.value.trim()) }} />
      <label>발행량</label>
      <input type="text" onChange={(e) => { setVolume(e.target.value.trim()) }} />
      <label>이미지</label>
      <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
      <button onClick={upload}>등록</button>
    </div>
  )
}

export default Register