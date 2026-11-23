// Compra de ingressos: desconta do estoque no Firestore.
import { doc, runTransaction } from "firebase/firestore";
import { db } from "./firebaseConnection";
import { COLECOES } from "../config/colecoes";

// itens = [{ id: "<id do ingresso>", qtd: 2 }, ...]
// Tudo acontece numa transação: ou todos os ingressos são descontados, ou nenhum.
// Se alguém comprou o mesmo ingresso ao mesmo tempo, a transação confere o estoque de novo
// e recusa a compra em vez de deixar o estoque ficar negativo.
export async function descontarEstoque(itens) {
  await runTransaction(db, async (transacao) => {
    const refs = itens.map((i) => doc(db, COLECOES.ingressos.colecao, i.id));

    // a transação exige que todas as leituras venham antes de qualquer escrita
    const snaps = [];
    for (const ref of refs) {
      snaps.push(await transacao.get(ref));
    }

    snaps.forEach((snap, indice) => {
      const { qtd } = itens[indice];
      const dados = snap.exists() ? snap.data() : null;
      const disponivel = Number(dados?.quantidadeDisponivel) || 0;

      if (!dados || dados.status !== "Disponível" || disponivel < qtd) {
        const erro = new Error("Estoque insuficiente");
        erro.code = "estoque-insuficiente";
        erro.tipo = dados?.tipo;
        throw erro;
      }
    });

    snaps.forEach((snap, indice) => {
      const restante = Number(snap.data().quantidadeDisponivel) - itens[indice].qtd;
      transacao.update(refs[indice], {
        quantidadeDisponivel: restante,
        // zerou o estoque: o ingresso passa a aparecer como esgotado
        ...(restante === 0 ? { status: "Esgotado" } : {}),
      });
    });
  });
}
