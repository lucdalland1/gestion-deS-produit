"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, ImageIcon } from "lucide-react"
import ProductForm from "../product-form"
import { useRouter } from "next/navigation"
import axios from "axios"

interface Product {
  id: number
  name: string
  image: string
  price: number
}

export default function DataTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadding, setLoadding] = useState(true)
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}products`
        const resp = await axios.get(url)
        setProducts(resp.data.data)
      } catch (error) {
        setError(true)
      } finally {
        setLoadding(false)
      }
    }
    fetchData()
  }, [refresh])

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    image: "",
    price: "",
  })

  const generateId = () => {
    return Math.max(...products.map((p) => p.id), 0) + 1
  }

  const handleAddProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      id: generateId(),
      ...productData,
    }
    setRefresh(refresh + 1)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setEditFormData({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (editingProduct && editFormData.name && editFormData.price) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editFormData.name,
              image: editFormData.image || "/placeholder.svg?height=60&width=60",
              price: Number.parseFloat(editFormData.price),
            }
          : p
      )
      setProducts(updatedProducts)
      setEditFormData({ name: "", image: "", price: "" })
      setEditingProduct(null)
      setIsEditOpen(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}products/${id}`
      const resp = await axios.delete(url)
      setRefresh(refresh + 1)
    } catch (error) {
      console.log('Erreur de suppression')
    }
  }

  const router = useRouter()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Produits</CardTitle>
              <CardDescription>Gérez votre catalogue de produits avec les opérations CRUD</CardDescription>
            </div>
            <ProductForm onAddProduct={handleAddProduct} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="w-32">Price</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loadding ? 'Chargement...' : 'Aucun produit trouvé. Ajoutez votre premier produit !'}
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow
                      key={product.id}
                      onClick={() => {
                        localStorage.setItem(product.id.toString(), JSON.stringify(product))
                        router.push('/products/' + product.id)
                      }}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={`http://localhost:8000/images/${product.image}` || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.price.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEdit(product)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier le produit</DialogTitle>
                                <DialogDescription>Modifiez les informations du produit</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Nom du produit</Label>
                                  <Input
                                    id="edit-name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    placeholder="Entrez le nom du produit"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-image">URL de l'image</Label>
                                  <Input
                                    id="edit-image"
                                    value={editFormData.image}
                                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                                    placeholder="https://exemple.com/image.jpg"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-price">Prix (€)</Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    value={editFormData.price}
                                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                  Annuler
                                </Button>
                                <Button onClick={handleUpdate}>Sauvegarder</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le produit {product.name} ? Cette action est
                                  irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
