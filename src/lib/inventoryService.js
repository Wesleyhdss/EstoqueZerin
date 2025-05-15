// src/lib/inventoryService.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

const colRef = collection(db, 'inventory');

// LISTAR todos os itens
export async function fetchItems() {
  const snap = await getDocs(colRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ADICIONAR um item
export async function addItem(data) {
  const docRef = await addDoc(colRef, data);
  return docRef.id;
}

// ATUALIZAR um item
export async function updateItem(id, data) {
  const docRef = doc(db, 'inventory', id);
  await updateDoc(docRef, data);
}

// DELETAR um item
export async function deleteItem(id) {
  const docRef = doc(db, 'inventory', id);
  await deleteDoc(docRef);
}