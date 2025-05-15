// src/contexts/ProductsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchItems,
  addItem as addToDb,
  updateItem as updateInDb,
  deleteItem as deleteFromDb
} from '../lib/inventoryService';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  // 1) Ao montar, carrega do Firestore
  useEffect(() => {
    fetchItems().then(setProducts);
  }, []);

  // 2) Adiciona no Firestore e no state
  const addItem = async data => {
    const id = await addToDb(data);
    setProducts(prev => [...prev, { id, ...data }]);
  };

  // 3) Atualiza no Firestore e no state
  const updateItem = async (id, data) => {
    await updateInDb(id, data);
    setProducts(prev =>
      prev.map(p => (p.id === id ? { id, ...data } : p))
    );
  };

  // 4) Deleta no Firestore e no state
  const deleteItem = async id => {
    await deleteFromDb(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{ products, addItem, updateItem, deleteItem }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// Hook para usar onde precisar
export const useProducts = () => useContext(ProductsContext);