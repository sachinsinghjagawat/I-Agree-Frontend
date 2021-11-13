import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import CheckLogin from '../CheckLogin';
import ContractCard from './ContractCard';


export default function ContractList() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    console.log("ContractList: ", userData);
    useEffect(() => {
        CheckLogin("/verify", navigate, setUserData);
        console.log("I Only run once (When the component gets mounted)")
    }, []);


    return (
        <div className="container">
            <h1>ContractList</h1>
            {userData.contracts && userData.contracts.map(contractId => {
                return <ContractCard
                    key={contractId}
                    id={contractId}
                />
            })}
        </div>
    )
}
