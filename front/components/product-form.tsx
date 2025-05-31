"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Plus } from "lucide-react"
import axios from "axios"

interface Product {
  id: number
  name: string
  image: string
  prix: number
}

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id">) => void
}

export default function ProductForm({ onAddProduct }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
    prix: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    prix: "",
    image: "",
  })

  const validateForm = () => {
    const newErrors = {
      name: "",
      prix: "",
      image: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du produit est requis"
    }

    if (!formData.prix.trim()) {
      newErrors.prix = "Le prix est requis"
    } else if (isNaN(Number(formData.prix)) || Number(formData.prix) <= 0) {
      newErrors.prix = "Le prix doit être un nombre positif"
    }

    if (formData.image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = "Seules les images JPEG, PNG, GIF ou WebP sont autorisées"
      }
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.prix && !newErrors.image
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const newProduct = {
        name: formData.name.trim(),
        image: formData.image
          ? formData.image.name
          : "/placeholder.svg?height=60&width=60",
        prix: Number.parseFloat(formData.prix),
      }

      onAddProduct(newProduct)

      try {
        const formPayload = new FormData()
        formPayload.append("name", newProduct.name)
        formPayload.append("price", newProduct.prix.toString())
        formPayload.append("description", "luc")
        if (formData.image) {
          formPayload.append("image", formData.image)
        }

        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}products`,
          formPayload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        console.log(resp)
      } catch (error) {
        console.log('Voila l erreur '+error.status);
        console.log(error.response.data.error)

        const newErrors = {
          name: "Ce nom existe deja dans la base de données ",
          prix: "",
          image: "",
        }
        setErrors(newErrors)
        return ;
      }

      resetForm()
      setIsOpen(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", image: null, prix: "" })
    setErrors({ name: "", prix: "", image: "" })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau produit. Les champs marqués
            d’un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Nom du produit <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Entrez le nom du produit"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image (fichier)</Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                if (file) {
                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                  ]
                  if (!allowedTypes.includes(file.type)) {
                    setErrors({
                      ...errors,
                      image: "Veuillez sélectionner uniquement une image valide",
                    })
                    setFormData({ ...formData, image: null })
                  } else {
                    setErrors({ ...errors, image: "" })
                    setFormData({ ...formData, image: file })
                  }
                } else {
                  setFormData({ ...formData, image: null })
                }
              }}
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
            {formData.image && (
              <p className="text-xs text-muted-foreground">
                Fichier sélectionné : {formData.image.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Laissez vide pour utiliser une image par défaut
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prix">
              Prix (€) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="prix"
              type="number"
              step="0.01"
              min="0"
              value={formData.prix}
              onChange={(e) =>
                setFormData({ ...formData, prix: e.target.value })
              }
              placeholder="0.00"
              className={errors.prix ? "border-red-500" : ""}
            />
            {errors.prix && (
              <p className="text-sm text-red-500">{errors.prix}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Ajouter le produit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
