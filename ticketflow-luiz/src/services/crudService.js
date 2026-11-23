import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConnection";

// READ: busca todos os documentos de uma coleção
export async function listar(nomeColecao) {
  const snapshot = await getDocs(collection(db, nomeColecao));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// CREATE: cria um documento novo (o Firestore gera o id)
export function criar(nomeColecao, dados) {
  return addDoc(collection(db, nomeColecao), dados);
}

// UPDATE: altera os campos de um documento existente
export function atualizar(nomeColecao, id, dados) {
  return updateDoc(doc(db, nomeColecao, id), dados);
}

// DELETE: apaga um documento
export function excluir(nomeColecao, id) {
  return deleteDoc(doc(db, nomeColecao, id));
}
