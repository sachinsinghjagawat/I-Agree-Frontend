import React, { useState } from 'react'

export default function ContractCondition(props) {
    const { index, condition, contractData, userData } = props;
    const [freelancerDone, setFreelancerDone] = useState(contractData.conditions[index].freelancer);
    const [clientDone, setClientDone] = useState(contractData.conditions[index].client);

    // console.log("index: ", index);
    // console.log("contractData: ", contractData);
    // console.log("userData: ", userData);

    async function sendData() {
        const response = await fetch("/setContractData", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                contractId: contractData._id,
                condition: contractData.conditions[index]
            }),
            credentials: "include"
        })
        const data = await response.json();
        console.log("data: ", data);
    }

    async function handleCheckboxClick(event, props, index) {
        try {
            const { name } = event.target;
            console.log("Hi", contractData.conditions[index][name]);
            if (contractData[name] === userData.address) {
                if (name === "freelancer") {
                    contractData.conditions[index].freelancer = !freelancerDone;
                    setFreelancerDone(!freelancerDone);
                }
                if (name === "client") {
                    contractData.conditions[index].client = !clientDone;
                    setClientDone(!clientDone);
                }
                sendData();
            } else {
                alert("You are not allowed to change this field");
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    return (
        <tbody>
            <tr>
                <td>{condition.condition}</td>
                <td><input type="checkbox" checked={freelancerDone} name="freelancer" onClick={event => handleCheckboxClick(event, props, index)} /></td>
                <td><input type="checkbox" checked={clientDone} name="client" onClick={event => handleCheckboxClick(event, props, index)} /></td>
            </tr>
        </tbody>
    )
}
