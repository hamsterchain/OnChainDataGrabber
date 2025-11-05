import type { NextPage } from 'next'
import React, { useState, useEffect } from "react";
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'
import * as Web3 from '@solana/web3.js'
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [isExecutable, setIsExecutable] = useState(false);
  const [buffdata, setData] = useState('')

  const addressSubmittedHandler = (address: string) => {
    try {
      setAddress(address)
      const key = new Web3.PublicKey(address)
      const connection = new Web3.Connection('https://rpc.shyft.to?api_key=qBnGxn3g4s9LpRTm')
      
      connection.getBalance(key).then(balance => {
        setBalance(balance / Web3.LAMPORTS_PER_SOL)
      })

      connection.getAccountInfo(key).then(info => {
        try{
          //CHANGES WERE MADE HERE
          var beforeSanitized = info!.data.toString()
          let index = beforeSanitized.indexOf("data");  
          let indexend = beforeSanitized.indexOf('","attributes');
          
          //let index = beforeSanitized.indexOf("");
          let valSanitised = beforeSanitized.substring(index,indexend);

          setData(valSanitised);
        } catch (error){
          setData('No data found on this address!')
        }
        
      })

      connection.getAccountInfo(key).then(info => {
        setIsExecutable(info?.executable ?? false);
      })
    } catch (error) {
      setAddress('')
      setData('Error!')
      setBalance(0)
      alert(error)
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Get On Chain Image Data for Blockrons <br></br>
        </p>
        <div className={styles.App3}>
        <p>
          You need the image container address! <br></br>
          try: E663ZsGzckou1Lw8nmyTZkgyg1E9j6DTGD5ja8nYib2N<br></br>
        </p>
        </div>
        <AddressForm handler={addressSubmittedHandler} />
        <div className={styles.App2}>
        <p>
            Instructions: <br></br>
            - Paste address into text box and press the button <br></br>
            - Copy the long string of text <br></br>
            - Paste into a new browser address <br></br>
        </p>
        </div>
        
        
        
        <div className={styles.App2}>
        <img src={`${buffdata}`}></img>
        <p>{`${buffdata}`}</p>
        </div> 
      </header>
      <body>
      </body>
    </div>
  )
}

export default Home
