import React, { useState } from 'react';
// import './App.css';
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contract from './components/contract/Contract';
import ContractItem from './components/contract/ContractItem';


function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/about" element={<About/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/contract" element={<Contract/>} />
        <Route exact path="/contractItem" element={<ContractItem/>} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
