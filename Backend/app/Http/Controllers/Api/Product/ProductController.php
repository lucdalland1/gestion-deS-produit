<?php

namespace App\Http\Controllers\Api\Product;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index(){
        try {
            return response()->json([
                'message' => 'Liste de produits',
                'data' => Product::all()
            ], 200);
            //code...
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'message' => 'Error al obtener los productos',
                'error' => $th->getMessage()
            ], 500);
        }
        
    }
    public function show($id){
        try {
            $product=Product::find($id);
            return response()->json([
                'message' => 'Produit trouve',
                'data' => $product
            ], 200);
            //code...
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'message' => 'Error al obtener el producto',
                'error' => $th->getMessage()
            ], 500);
        }
        
    }
    public function store(Request $request){
        try {
            $validate = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ], [
                'name.required' => 'Le nom du produit est obligatoire.',
                'name.string' => 'Le nom du produit doit être une chaîne de caractères.',
                'name.max' => 'Le nom du produit ne peut pas dépasser 255 caractères.',
            
                'description.required' => 'La description est obligatoire.',
                'description.string' => 'La description doit être une chaîne de caractères.',
            
                'price.required' => 'Le prix est obligatoire.',
                'price.numeric' => 'Le prix doit être un nombre.',
            
                'image.required' => 'L’image du produit est obligatoire.',
                'image.image' => 'Le fichier doit être une image.',
                'image.mimes' => 'L’image doit être de type : jpeg, png, jpg, gif, svg.',
                'image.max' => 'La taille de l’image ne doit pas dépasser 2 Mo.',
            ]);
            

            $product=new Product();
            $product->name=$validate['name'];
            $product->description=$validate['description'];
            $product->price=$validate['price'];
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $product->image=$imageName;
            $product->save();
            return response()->json([
                'message' => 'Produit cree',
                'data' => $product
            ], 201);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'message' => 'Error de creation produit',
                'error' => $th->getMessage()
            ], 500);
        }
        
    }
    public function update(Request $request, $id)
    {
        try {
            $validate = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'sometimes|required|numeric',
                'image' => 'sometimes|required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
    
            $product = Product::find($id);
            if (!$product) {
                return response()->json([
                    'message' => 'Produit non trouvé'
                ], 404);
            }
    
            // Update les champs simples
            $product->fill($validate);
    
            // Si une nouvelle image est envoyée
            if ($request->hasFile('image')) {
                // Supprimer l’ancienne image
                if ($product->image && file_exists(public_path('images/' . $product->image))) {
                    unlink(public_path('images/' . $product->image));
                }
    
                $imageName = time() . '.' . $request->image->extension();
                $request->image->move(public_path('images'), $imageName);
                $product->image = $imageName;
            }
    
            $product->save();
    
            return response()->json([
                'message' => 'Produit modifié',
                'data' => $product
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Erreur de modification du produit',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id){
        try {
            $product=Product::find($id);
            $product->delete();
            return response()->json([
                'message' => 'Produit supprime',
                'data' => $product
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'message' => 'Error de suppression produit',
                'error' => $th->getMessage()
            ], 500);
        }
        
    }
}
