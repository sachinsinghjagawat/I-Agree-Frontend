import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import CheckLogin from '../CheckLogin';
import CreateContract from './CreateContract';
import ContractList from './ContractList';

export default function Contract() {
    const navigate = useNavigate();

    CheckLogin("/verify", navigate);
    console.log("hi");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    return (
        <div>
            <CreateContract/>
            <hr/>
            <ContractList/>
        </div>
    )
}
