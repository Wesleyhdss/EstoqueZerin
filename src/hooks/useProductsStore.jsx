
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PRODUCTS_STORAGE_KEY = 'inventoryAppProducts';

const initialProducts = [
  {
    id: 'SKU001',
    name: 'Camiseta Básica Branca',
    description: 'Camiseta de algodão confortável, cor branca.',
    category: 'Vestuário Superior',
    stock: 50,
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    variations: [
      { id: 'SKU001-S', size: 'P', color: 'Branca', stock: 20, price: 29.99, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
      { id: 'SKU001-M', size: 'M', color: 'Branca', stock: 30, price: 29.99, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    ],
  },
  {
    id: 'SKU002',
    name: 'Calça Jeans Azul Escuro',
    description: 'Calça jeans skinny, lavagem azul escuro.',
    category: 'Vestuário Inferior',
    stock: 35,
    price: 89.90,
    imageUrl: 'https://images.unsplash.com/photo-1602293589930-4535a9ac7d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    variations: [
      { id: 'SKU002-38', size: '38', color: 'Azul Escuro', stock: 15, price: 89.90, imageUrl: 'https://images.unsplash.com/photo-1602293589930-4535a9ac7d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
      { id: 'SKU002-40', size: '40', color: 'Azul Escuro', stock: 20, price: 89.90, imageUrl: 'https://images.unsplash.com/photo-1602293589930-4535a9ac7d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    ],
  },
];


const getStoredProducts = () => {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
  return initialProducts;
};

export const useProductsStore = () => {
  const [products, setProducts] = useState(getStoredProducts());
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || `SKU${Date.now()}`, // Ensure SKU is unique
      variations: productData.variations || [],
      imageUrl: productData.imageUrl || '',
    };
    setProducts((prevProducts) => {
      if (prevProducts.find(p => p.id === newProduct.id)) {
        toast({ title: "Erro", description: "SKU já existe.", variant: "destructive" });
        return prevProducts;
      }
      toast({ title: "Sucesso", description: "Produto adicionado." });
      return [...prevProducts, newProduct];
    });
  }, [toast]);

  const updateProduct = useCallback((productId, updatedData) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
    toast({ title: "Sucesso", description: "Produto atualizado." });
  }, [toast]);
  
  const getProductById = useCallback((productId) => {
    return products.find(p => p.id === productId);
  }, [products]);

  const addVariation = useCallback((productId, variationData) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const newVariation = { 
            ...variationData, 
            id: variationData.id || `${productId}-VAR${Date.now()}`,
            imageUrl: variationData.imageUrl || p.imageUrl, // Default to parent image
          };
          if (p.variations.find(v => v.id === newVariation.id)) {
            toast({ title: "Erro", description: "SKU da variação já existe.", variant: "destructive" });
            return p;
          }
          toast({ title: "Sucesso", description: "Variação adicionada." });
          return { ...p, variations: [...p.variations, newVariation] };
        }
        return p;
      })
    );
  }, [toast]);

  const updateVariation = useCallback((productId, variationId, updatedVariationData) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variations: p.variations.map((v) =>
              v.id === variationId ? { ...v, ...updatedVariationData } : v
            ),
          };
        }
        return p;
      })
    );
    toast({ title: "Sucesso", description: "Variação atualizada." });
  }, [toast]);
  
  const updateStock = useCallback((productId, variationId, amountChange) => {
    setProducts(prevProducts => 
      prevProducts.map(p => {
        if (p.id === productId) {
          if (variationId) { // Update variation stock
            const updatedVariations = p.variations.map(v => 
              v.id === variationId ? { ...v, stock: Math.max(0, (v.stock || 0) + amountChange) } : v
            );
            const totalStockFromVariations = updatedVariations.reduce((sum, v) => sum + (v.stock || 0), 0);
            toast({ title: "Sucesso", description: "Estoque da variação atualizado." });
            return { ...p, variations: updatedVariations, stock: totalStockFromVariations };
          } else { // Update parent product stock (if no variations or managing overall)
            toast({ title: "Sucesso", description: "Estoque do produto atualizado." });
            return { ...p, stock: Math.max(0, (p.stock || 0) + amountChange) };
          }
        }
        return p;
      })
    );
  }, [toast]);


  return { products, addProduct, updateProduct, getProductById, addVariation, updateVariation, updateStock, setProducts };
};
  