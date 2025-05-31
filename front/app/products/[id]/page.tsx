'use client'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
    const route = useRouter();
    const bouton = () => {
        route.back()
    }
    const { id } = useParams()
    const [loadding, setLoadding] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchtData = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_URL}products/${id}`
            try {
                const response = await axios.get(url);
                setData(response.data.data)
            } catch (error) {
                setError(error)
            } finally {
                setLoadding(false)
            }
        }
        fetchtData();
    }, [id])
    console.log(data)

    if (loadding) return <p className='flex items-center justify-center min-h-screen'>
        chargement ...
    </p>
    if(data)
    return (
        <div className='max-w-3xl m-auto  min-h-screen flex flex-col items-center gap-3'>
            <h1 className=" dark:bg-white/[.06] px-1 py-0.5 rounded text-xl font-[family-name:var(--font-geist-mono)] font-semibold">
                View Product</h1>
            <div className='flex row h-auto justify-around bg-zinc-400 p-3 w-full shadow-md rounded-lg'>
                <div>id</div>
                <div>name</div>
                <div>price</div>
            </div>

            <div className='flex row h-auto justify-around p-3 w-full'>
                <div>{data['name']}</div>
                <div>{data['price']}</div>
            </div>
            <img src={`http://localhost:8000/images/${data['image']}`} alt="jdjidjj" height={200} width={300} className='rounded' />

            <Button onClick={bouton}>retour</Button>
        </div>

    );else return( <p>Product supprimer avec succes </p>)
}

export default page