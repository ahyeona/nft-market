import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useWeb3 from './hooks/web3.hook';
import abi from "./abi/sale.json";
import { Detail, List, Mypage, Register } from "./pages";
import Nav from "./nav/Nav";
import Modal from "./components/utils/modal/Modal";
import css from "./App.css";

const App = () => {
  const { user, web3 } = useWeb3();
  const [contract, setContract] = useState(null);
  const CA = "0x7D5192973aB61fA91FBE9dee8d846760f0C86F7B";

  const nav = useNavigate();

  useEffect(()=>{
    if (web3 == null) return;
    const sale = new web3.eth.Contract(abi, CA, {data : ""});
    setContract(sale);
  }, [web3]);

  if (contract == null) return <Modal title={"잠시만 기다려주세요."} content={""}/>;

  document.body.style.overflow = "visible";

  return (
    <div className="App">
      <div style={{cursor:"pointer"}} onClick={()=>{nav("/")}}><h2 >NFT 마켓</h2></div>
      <div id="nav"><Nav user={user} /></div>

      <div id="page">
        <Routes>
          <Route path="/" element={<List user={user} web3={web3} contract={contract} />}/>
          <Route path="/detail/:id" element={<Detail user={user} web3={web3} contract={contract} />} />
          <Route path="/register" element={<Register user={user} web3={web3} contract={contract} />} />
          <Route path="/mypage" element={<Mypage user={user} web3={web3} contract={contract} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
