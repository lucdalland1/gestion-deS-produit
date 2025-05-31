"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

function page() {
  const [data, setData]=useState([]);
  const [loadding, setLoadding]=useState(false);
  const [error,setError]=useState(false)

  useEffect(() => {
    const fetchData=async ()=>{
      try {
        const url =process.env.NEXT_PUBLIC_API_URL
        const response =await axios.get(`${url}products`)
        // setData(response.data.data)
        console.log(response.data.data);
        setData(response.data.data);

        
      } catch (error) {
        setError(true);
        
      }finally {
          setLoadding(true)
      }
    }
    fetchData();
  
  }, [])

 if(error)return <p>error cte serveur </p> 
 if(!loadding) return (
    <div>Chargement... </div>
  );
  return <p>
    {data.map((item)=>{
      return <li key={`${item['id']}`}>
        {item['name']}

      </li>

    })}
  </p>
}

export default page