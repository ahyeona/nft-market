import React, { useState } from 'react'
import axios from 'axios'
import { Btn } from '../utils/btn.styled';

const TokenAdditionalInfo = ({ el, user, web3, contract, setModal, setTitle, setContent }) => {
    const [priceInput, setPriceInput] = useState(null);

    const getDecimal = () => {
        const num = Number(priceInput);
        const decimal = num.toString().split('.')[1]?.length || 0;
        const price = num * (10 ** decimal);
        if (!price || price == 0) {
            alert("숫자로 입력");
            return false;
        }
        if (num <= 0) {
            alert("음수 안됨");
            return false;
        }
        return [price, decimal]
    }

    const minting = async () => {
        if (el.volume <= 0) {
            alert("발행 횟수 초과");
            return;
        }
        const getdecimal = getDecimal(priceInput);
        console.log("get", getdecimal);
        if (getdecimal == false) {
            return;
        }

        setTitle("지갑");
        setContent("NFT를 발행하려면 지갑에서 진행해주세요.");
        setModal(true);        

        const data = await contract.methods._saleNFTmint(el.jsonHash, getdecimal[0], getdecimal[1]).send({
            from: user.account
        });
        console.log(data);

        setModal(false);
        window.location.reload();
    }

    return (
        <div style={{ backgroundColor: "aliceblue", marginRight:"20px", marginBottom:"20px"}}>
            이름 : {el.name}<br />
            설명 : {el.description}<br />
            랭킹 : {el.ranking}<br />
            <img src={el.image} width={"200px"} /><br />

            {
                el.volume <= 0 ?
                    <>
                        발행 완료
                    </> :
                    <>
                        남은 발행량 : {el.volume}<br />
                        <label>금액</label>
                        <input type="text" onChange={(e) => { setPriceInput(e.target.value.trim()) }} />ETH
                        <Btn onClick={minting}>판매</Btn>
                    </>
            }
        </div>
    )
}

export default TokenAdditionalInfo