import lottery from "./lottery";
import "./App.css";
import web3 from "./web3";
import React, { useEffect } from "react";

function App() {
  //either use this line to connect or uncomment the secciont in the web3js file if you'd use web3
  window.ethereum.enable();
  const [manager, setManager] = React.useState("");
  const [players, setPlayers] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [values, setValue] = React.useState("");
  const [uxSystem, setUXSystem] = React.useState({
    message: "",
    loading: false,
  });

  React.useEffect(() => {
    (async () => {
      //manager is the account it was deployed from
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      const blManager = await web3.eth.getBalance(manager);
      setManager(manager);
      setPlayers(players);
      setBalance(web3.utils.fromWei(balance));
      // console.log("it was deployed to", lottery.options.address);
      // console.log(
      //   "balance of deployer address :from address",
      //   web3.utils.fromWei(blManager)
      // );
    })();
  }, []);
  const onSubmit = async (e) => {
    setUXSystem({ ...uxSystem, message: "Waiting to be entered! " });

    try {
      e.preventDefault();
      const accountList = await web3.eth.getAccounts();
      await lottery.methods.enter().send({
        from: accountList[0],
        value: web3.utils.toWei(values, "ether"),
      });
      setUXSystem({ ...uxSystem, message: "You have been entered! " });
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setPlayers(players);
      setBalance(web3.utils.fromWei(balance));
    } catch (e) {
      console.log("error", e);
      setUXSystem({ ...uxSystem, message: "Error Occured!" });
    }
  };
  // web3.eth.getAccounts().then((res) => console.log(res));
  const pickWinner = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      setUXSystem({
        ...uxSystem,
        message: "Waiting to be transaction success! ",
      });
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      setUXSystem({
        ...uxSystem,
        message: "Winnner has been picked! ",
      });
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
    } catch (e) {
      console.log("error", e);
      setUXSystem({ ...uxSystem, message: "Error Occured!" });
      setPlayers(players);
      setBalance(web3.utils.fromWei(balance));
    }
  };
  // console.log(accounts);
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This Contracted is managed by : {manager}</p>
      <p>
        There are currently {players.length} people entered competing to win{" "}
        {balance} ether.
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of Ether to ether </label>
          <input value={values} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner? </h4>
      <button onClick={pickWinner}>Pick a winner!</button>
      <hr />
      <h1>{uxSystem.message}</h1>
    </div>
  );
}

export default App;
