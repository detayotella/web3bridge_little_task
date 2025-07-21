import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress =  "0xDC55235fbA58deCD447b932FAef0f35D6A65aa89";

function App() {
  const [text, setText] = useState("");
  const [displayMessage, getTheMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        setErrorMessage("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      setErrorMessage("Error setting message:", error);
      alert(error.message || error);
    }
  };

  const handleGet = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const message = await contract.getMessage();
      //console.log("Current message:", message);
      getTheMessage(message); 
    } else {
      setErrorMessage("MetaMask not found. Please install MetaMask to use this application.");
    }
  } catch (error) {
    setErrorMessage("Error getting message: " + (error.message || error));
    alert(error.message || error);
  }
};

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <p>{errorMessage}</p>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
      <button onClick={handleGet}>Get Message</button>
    </div>
  );
}

export default App;
