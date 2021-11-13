import React, { useState } from 'react';
import { ethers } from "ethers";

export default function Login() {
    const [status, setStatus] = useState();

    async function handleLogin(event) {
        try {
            setStatus("Connecting to wallet...");
            if (!window.ethereum) {
                setStatus("No Metamask wallet... Please install it");
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []).catch((error) => {
                console.log(error);
            })
            const signer = provider.getSigner();
            const walletAddress = await signer.getAddress();
            console.log(walletAddress);

            let response = await fetch("/auth/nonce", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    walletAddress
                })
            })
            const { nonce } = await response.json();

            const signature = await signer.signMessage(nonce);
            console.log(signature);

            let response2 = await fetch("/auth/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    walletAddress,
                    nonce,
                    signature
                })
            })
            const { message, token } = await response2.json();
            console.log(message, token);
            setStatus("Signin Successful");
        } catch (err) {
            setStatus("SignIn Failed. Please try again");
            console.log(err);
        }
    }

    return (
        <>
            <p>{status}</p>
            <button onClick={handleLogin} >Sign up</button>
        </>
    )
}
