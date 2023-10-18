import React, { useState } from 'react'
import axios from 'axios'

const TokenAdditionalInfo = ({ el, user, web3, contract }) => {
    const [price, setPrice] = useState(0);

    const minting = async () => {
        const data = await contract.methods._saleNFTmint(el.jsonHash, price).send({
            from : user.account
        });
        console.log(data);
    }

    return (
        <div style={{backgroundColor : "aliceblue"}}>
            이름 : {el.name}<br />
            설명 : {el.description}<br />
            랭킹 : {el.ranking}<br />
            남은 발행량 : {el.volume}<br />
            <img src={el.image} width={"200px"} /><br />

            <label>금액</label>
            <input type="text" onChange={(e)=>{setPrice(e.target.value)}} />ETH
            <button onClick={minting}>판매</button>
        </div>
    )
}

export default TokenAdditionalInfo