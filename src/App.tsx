import React, { useState } from 'react';
import { Button, Row, Col, Card, Container, Form } from 'react-bootstrap';
import { injected } from './hooks/connectors'
import { useWeb3React } from '@web3-react/core';
import Token from './ABI/token-ero20.json'
import './App.css';
import useBalance from './hooks/useBalance';


function App() {

  const { active, account, library, connector, activate, deactivate, error } = useWeb3React()

  const connect = async () => {
    try {
      await activate(injected)
    } catch (err) {
      console.log(err)
    }
  }

  const disconnect = () => {
    try {
      deactivate()
    } catch (err) {
      console.log(err)
    }
  }

  const [balance] = useBalance(
    Token[1].address,
    Token[1].decimals
  )

  console.log(balance)

  return (
    <Container className="mt-5">
      <Button onClick={connect}>Connect to Metamask</Button>
      {active ? <p>{account}</p> : <p>Not Connected</p>}
      <Button onClick={disconnect}>Disconnect</Button>

      {Token.map((token, index) => {
        return <p key={index}>{token.name} balance : {balance} </p>
      })}
    </Container >
  );
}

export default App;
