import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConnection";

export async function listar(nomeColecao) {
  const snapshot = await getDocs(collection(db, nomeColecao));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function criar(nomeColecao, dados) {
  return addDoc(collection(db, nomeColecao), dados);
}

export function atualizar(nomeColecao, id, dados) {
  return updateDoc(doc(db, nomeColecao, id), dados);
}

export function excluir(nomeColecao, id) {
  return deleteDoc(doc(db, nomeColecao, id));
}
