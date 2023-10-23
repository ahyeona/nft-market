import { useEffect, useState } from "react";
import Web3 from "web3";

const useWeb3 = () => {
    const [user, setUser] = useState({
        account: "",
        balance: "",
    });
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_requestAccounts" }).then(async ([data]) => {
                const web3Provider = new Web3(window.ethereum);

                setUser({
                    account: data,
                    balance: web3Provider.utils.fromWei(await web3Provider.eth.getBalance(data), "ether"),
                });
                setWeb3(web3Provider);

                window.ethereum.on("accountsChanged", async (accounts) => {
                    setUser({
                        account: accounts[0],
                        balance: web3Provider.utils.fromWei(await web3Provider.eth.getBalance(accounts[0]), "ether"),
                    });
                });

                window.ethereum.on("chainChanged", async (chainId) => {
                    console.log("네트워크가 변경되었음", chainId);
                    // if (chainId !== "0x539") { // ganache
                    if (chainId !== "0xaa36a7") { // 세폴리아
                    //   const net = await window.ethereum.request({jsonrpc : "2.0", method : "wallet_switchEthereumChain", params : [{chainId : "0x539"}]});
                    // const net = await window.ethereum.request({jsonrpc : "2.0", method : "wallet_switchEthereumChain", params : [{chainId : "0xaa36a7"}]});

                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            // params: [{ chainId: "0x539" }],
                            params: [{ chainId: "0xaa36a7" }],
                        });
                        alert("네트워크 연결");
                    }
                  });

            });
        } else {
            alert("메타마스크 설치해주세요");
        }
    }, []);

    return { user, web3 }
}

export default useWeb3;