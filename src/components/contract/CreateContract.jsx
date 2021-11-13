import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from "ethers";
import CheckLogin from '../CheckLogin';
import IAgreeContract from '../../contractAbi/IAgreeContract.json'
import Token from '../../contractAbi/Token.json';

export default function CreateContract() {
    const [freelancerAddress, setFreelancerAddress] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [inputText, setInputText] = useState("");
    const [items, setItems] = useState([]);
    const [userData, setUserData] = useState({});
    const [value, setValue] = useState('0');
    const [token, setToken] = useState("Select Token");
    let key="";

    const navigate = useNavigate();

    useEffect(() => {
        CheckLogin("/verify", navigate, setUserData);
        console.log("I Only run once (When the component gets mounted)")
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "freelancerAddress") setFreelancerAddress(value);
        else if (name === "title") setTitle(value);
        else if (name === "description") setDescription(value);
        else if (name === "condition") setInputText(value);
    }

    async function handleSendContract() {
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
            const iagAddress = "0xe35E8716069c3a3A46B3555AFafE5dCcf0A4742F";
            const iagAbi = Token.abi;

            const iAgreeContract = new ethers.Contract(iAgreeAddress, iAgreeAbi, provider);
            const iagContract = new ethers.Contract(iagAddress, iagAbi, provider);

            const name = await iagContract.name();
            console.log(name);

            const iagWithSigner = iagContract.connect(signer);
            const iAgreeWithSigner = iAgreeContract.connect(signer);
            console.log(iAgreeWithSigner);

            const dai = ethers.utils.parseUnits("1.0", 18);
            console.log(dai);

            console.log("Key: ", key)
            const temp = "100000000000000000000";
            const tx = await iagWithSigner.approve("0xf1Fb8f200BEd8D55243dca56FaF76d72f4d79f00", value);
            console.log("tx hash : ", tx.hash);
            iagContract.on("Approval", (address, spender, value) => {
                console.log(address, spender, value);
            })
            await tx.wait();
            console.log("Pappu pass ho gaya!");
            console.log("tx : ", tx);

            var date = new Date().getTime();

            const tx2 = await iAgreeWithSigner.depositTokens( freelancerAddress , iagAddress, value, key, date);
            console.log("tx2 hash : ", tx2.hash);
            
            await tx2.wait();
            console.log("Pappu phir se pass ho gaya!");
            console.log("tx2 : ", tx2);

            // let tx = await daiWithSigner.    

        } catch (error) {
            console.log("Error: " + error);
        }
    }

    function addCondition() {
        if (inputText.length <= 0) {
            alert("Empty condition cannot be Added");
            return;
        }
        setItems(prevItems => {
            const object = {
                condition: inputText,
                freelancer: false,
                client: false
            }
            return [...prevItems, object];
        });
        setInputText("");
    }

    async function saveContract() {
        console.log("Saving contract...");
        const data = {
            freelancer: freelancerAddress,
            status: 1,
            title: title,
            description: description,
            conditions: items,
            value: value,
            token: token
        };

        const response = await fetch("/addContract", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                contract: data
            }),
            credentials: "include"
        })
        const temp = await response.json();
        key = temp.key;
        console.log(temp);

    }
    function sendContract() { }
    return (
        <div className="container">
            <h1>Create Contract</h1>
            <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">Freelancer Address</label>
                <input onChange={handleChange} value={freelancerAddress} type="email" className="form-control" name="freelancerAddress" id="exampleFormControlInput1" placeholder="0x..." />
            </div>
            <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">Title</label>
                <input onChange={handleChange} value={title} type="email" className="form-control" name="title" id="exampleFormControlInput2" placeholder="Project name..." required />
            </div>
            <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">Description</label>
                <textarea onChange={handleChange} value={description} className="form-control" name="description" id="exampleFormControlTextarea1" rows="3" placeholder="This project is about..." required ></textarea>
            </div>
            <div>
                <label for="exampleFormControlInput1" className="form-label">Conditions</label>
                <div className="input-group mb-3 form">
                    <input onChange={handleChange} name="condition" className="form-control" type="text" value={inputText} placeholder="I want this feature..." />
                    <div className="input-group-append">
                        <button onClick={addCondition} className="btn btn-primary">
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <div>
                    <ul>
                        {items.map(todoItem => (
                            <li>{todoItem.condition}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <label for="exampleFormControlInput1" className="form-label">Amount</label>
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={event => {
                    setValue (event.target.value);
                    console.log(value);
                }} aria-label="Text input with dropdown button" 
                placeholder="Amount in Wei" required />
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">{token}</button>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" onClick={() => {
                        setToken("IAG");
                    }}>IAG</a></li>
                    <li><a className="dropdown-item" onClick={() => {
                        setToken("BNB");
                    }}>BNB</a></li>
                    <li><a className="dropdown-item" onClick={() => {
                        setToken("BUSD");
                    }}>BUSD</a></li>
                    {/* <li><hr className="dropdown-divider" /></li> //to be used in future for adding Other Tokens */}
                </ul>
            </div>
            <button onClick={saveContract} className="btn btn-primary">Save Contract</button>
            <button onClick={handleSendContract} className="btn btn-primary">Send Contract</button>
        </div>
    )
}
