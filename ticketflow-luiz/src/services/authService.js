// Funções de login do Firebase Authentication (e-mail e senha).
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConnection";

// Perfis possíveis: "admin" (cadastra e edita tudo) e "comum" (só visualiza)
export const PAPEL_ADMIN = "admin";
export const PAPEL_COMUM = "comum";

// Entra com e-mail e senha
export function entrar(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

// Cria uma conta nova. Quem se cadastra sempre entra como "comum":
// o perfil "admin" só pode ser dado por quem administra o banco (e as regras do Firestore).
// Ao criar a conta o Firebase já deixa a pessoa logada, então o App libera o site sozinho.
export async function cadastrar(nome, email, senha) {
  const credencial = await createUserWithEmailAndPassword(auth, email, senha);
  try {
    await updateProfile(credencial.user, { displayName: nome });
    await setDoc(doc(db, "usuarios", credencial.user.uid), { nome, email, papel: PAPEL_COMUM });
  } catch (erro) {
    // a conta já foi criada; sem o documento a pessoa é tratada como "comum" do mesmo jeito
    console.error("Conta criada, mas não foi possível salvar o perfil:", erro);
  }
  return credencial;
}

// Sai da conta
export function sair() {
  return signOut(auth);
}

// Envia um e-mail para a pessoa criar uma senha nova
export function recuperarSenha(email) {
  return sendPasswordResetEmail(auth, email);
}

// Avisa sempre que alguém entra ou sai (e quando a página abre).
// Devolve uma função para parar de observar.
export function observarUsuario(callback) {
  return onAuthStateChanged(auth, callback);
}

// Descobre o perfil de quem entrou. O perfil fica no documento usuarios/{uid}, campo "papel".
// Se o documento não existir (ou der qualquer erro), a pessoa é tratada como "comum":
// na dúvida, o acesso é o mais restrito.
export async function buscarPapel(uid) {
  try {
    const snap = await getDoc(doc(db, "usuarios", uid));
    return snap.exists() && snap.data().papel === PAPEL_ADMIN ? PAPEL_ADMIN : PAPEL_COMUM;
  } catch (erro) {
    console.error("Não foi possível ler o perfil do usuário:", erro);
    return PAPEL_COMUM;
  }
}

// Traduz o código de erro do Firebase para uma mensagem em português
export function mensagemDeErro(erro, padrao = "Não foi possível entrar. Tente novamente.") {
  switch (erro?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/invalid-email":
      return "Digite um e-mail válido.";
    case "auth/user-disabled":
      return "Esta conta foi desativada.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde um pouco e tente de novo.";
    case "auth/network-request-failed":
      return "Sem conexão. Verifique a internet e tente de novo.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado. Volte e entre com a sua senha.";
    case "auth/weak-password":
      return "A senha é fraca. Use pelo menos 6 caracteres.";
    default:
      return padrao;
  }
}
