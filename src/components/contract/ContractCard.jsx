import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function ContractCard(props) {
    console.log("Props", props);
    const navigate = useNavigate();
    const [contractData, setContractData] = useState({});

    useEffect(() => {
        getContractData();
    }, []);

    async function getContractData() {
        try {
            const response = await fetch("/contractData", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    id: props.id
                }),
                credentials: "include"
            })
            const data = await response.json();
            if (!data || data.error) throw new Error(data.error);
            setContractData(data);
        } catch (err) {
            console.log(err);
        }
    }

    function handleShowMore (){
        navigate( "/contractItem", {state: props.id} );
    }

    return (
        <>
            <div class="card">
                <div class="card-header">
                    from: {contractData.client} to: {contractData.freelancer}
                </div>
                <div class="card-body">
                    <h5 class="card-title">{contractData.title}</h5>
                    <p class="card-text">{contractData.description}</p>
                    <button onClick={handleShowMore} class="btn btn-primary">Show More</button>
                </div>
            </div>
        </>
    )
}
