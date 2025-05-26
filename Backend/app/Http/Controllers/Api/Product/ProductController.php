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
    public function store(Request $request){
        try {
            $validate = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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
}
