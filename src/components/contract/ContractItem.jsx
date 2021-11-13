import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import CheckLogin from '../CheckLogin';
import ContractCondition from './ContractCondition';
import IAgreeContract from '../../contractAbi/IAgreeContract.json'

export default function ContractItem() {
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log("Props: ", state);

    const [contractData, setContractData] = useState({
        title: "loading..."
    });
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getData();
    }, []);


    async function getData() {
        try {
            const response = await fetch("/contractData", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    id: state
                }),
                credentials: "include"
            })
            const data = await response.json();
            if (!data || data.error) throw new Error(data.error);
            setContractData(data);
            CheckLogin("/verify", navigate, setUserData);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleWithdrawMoney () {
        try {
            if (!window.ethereum) {
                alert("No Metamask wallet... Please install it");
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []).catch((error) => {
                console.log(error);
            })
            const signer = provider.getSigner();
            const walletAddress = await signer.getAddress();
            if (walletAddress !== userData.address) {
                alert("Please use the same wallet with which you Logged in.");
                return;
            }
            console.log(walletAddress);

            const iAgreeAddress = "0xf1Fb8f200BEd8D55243dca56FaF76d72f4d79f00";
            const iAgreeAbi = IAgreeContract.abi;

            const iAgreeContract = new ethers.Contract(iAgreeAddress, iAgreeAbi, provider);

            const iAgreeWithSigner = iAgreeContract.connect(signer);
            console.log(iAgreeWithSigner);

            const dai = ethers.utils.parseUnits("1.0", 18);
            console.log(dai);

            // const temp = "100000000000000000000";

            
            const response = await fetch("/requestKey", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    id: state
                }),
                credentials: "include"
            })
            const {key} = await response.json();
            console.log("Hi");
            const key2 = key.toString();
            console.log(key2);

            const tx = await iAgreeWithSigner.withdrawTokens( contractData.client , key2);
            console.log("tx2 hash : ", tx.hash);
            
            await tx.wait();
            console.log("Pappu pass ho gaya!");
            console.log("tx2 : ", tx);

        } catch (error) {
            console.log("Error: " + error);
        }
    }
    async function handleDropContract () {
        try {
            if (!window.ethereum) {
                alert("No Metamask wallet... Please install it");
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []).catch((error) => {
                console.log(error);
            })
            const signer = provider.getSigner();
            const walletAddress = await signer.getAddress();
            if (walletAddress !== userData.address) {
                alert("Please use the same wallet with which you Logged in.");
                return;
            }
            console.log(walletAddress);

            const iAgreeAddress = "0xf1Fb8f200BEd8D55243dca56FaF76d72f4d79f00";
            const iAgreeAbi = IAgreeContract.abi;

            const iAgreeContract = new ethers.Contract(iAgreeAddress, iAgreeAbi, provider);

            const iAgreeWithSigner = iAgreeContract.connect(signer);
            console.log(iAgreeWithSigner);

            const tx = await iAgreeWithSigner.dropContract( contractData.client );
            console.log("tx hash : ", tx.hash);
            
            await tx.wait();
            console.log("Pappu pass ho gaya!");
            console.log("tx : ", tx);

        } catch (error) {
            console.log("Error: " + error);
        }
    }

    return (
        <div className="container">
            <h1>{contractData.title} </h1>
            <p>{contractData.description}</p>
            {contractData.freelancer === userData.address && <>
                <button onClick={handleWithdrawMoney} className="btn btn-primary">Withdraw Money</button>
                <button onClick={handleDropContract} className="btn btn-primary">Drop Contract</button>
            </>}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Condition</th>
                        <th scope="col">{contractData.freelancer === userData.address ? "You" : "Freelancer"}</th>
                        <th scope="col">{contractData.client === userData.address ? "You" : "Client"}</th>
                    </tr>
                </thead>
                {contractData.conditions && contractData.conditions.map((condition, index) => {
                    return <ContractCondition
                        key={index}
                        index={index}
                        condition={condition}
                        contractData={contractData}
                        userData={userData}
                    />
                })}
            </table>
        </div>
    )
}
