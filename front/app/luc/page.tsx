'use client'

import React, { useEffect, useState } from 'react'

export default function ProductList() {



  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)  // ← attention au slash
        if (!res.ok) throw new Error('Erreur serveur')
        const json = await res.json()
        console.log('Réponse API:', json)
        setProducts(json.data)
      } catch (err) {
        console.error('Erreur lors du fetch :', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Chargement en cours...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <div>
      <h1>Liste des produits</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - {product.prix} €
          </li>
        ))}
      </ul>
    </div>
  )
}
