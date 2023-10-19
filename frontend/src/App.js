import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import useWeb3 from './hooks/web3.hook';
import abi from "./abi/sale.json";
import { Detail, List, Mypage, Register } from "./pages";

const App = () => {
  const { user, web3 } = useWeb3();
  const [contract, setContract] = useState(null);
  const CA = "0xeB5f6aAbaD742a9Fd87675418E9F1d846f83f6Ba";

  useEffect(()=>{
    if (web3 == null) return;
    const sale = new web3.eth.Contract(abi, CA, {data : ""});
    setContract(sale);
  }, [web3]);

  if (contract == null) return "contract null";

  return (
    <div className="App">
      <h2>{user.account}</h2>
      <Routes>
        <Route path="/" element={<List user={user} web3={web3} contract={contract} />}/>
        <Route path="/detail/:id" element={<Detail user={user} web3={web3} contract={contract} />} />
        <Route path="/register" element={<Register user={user} web3={web3} contract={contract} />} />
        <Route path="/mypage" element={<Mypage user={user} web3={web3} contract={contract} />} />
      </Routes>
    </div>
  );
}

export default App;
