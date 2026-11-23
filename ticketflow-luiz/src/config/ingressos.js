// Campos do formulário e colunas da tabela da coleção "ingressos".

export const ingressosConfig = {
  chave: "ingressos",
  colecao: "ingressos",
  menu: "Ingressos",
  titulo: "Ingressos",
  campoNome: "tipo",
  colunas: ["eventoId", "tipo", "lote", "preco", "quantidadeDisponivel", "status"],
  campos: [
    { nome: "eventoId", rotulo: "Evento", tipo: "ref", ref: "eventos", obrigatorio: true },
    {
      nome: "tipo",
      rotulo: "Tipo de ingresso",
      tipo: "select",
      opcoes: ["Pista", "Camarote", "Área VIP", "Arquibancada"],
      obrigatorio: true,
    },
    { nome: "preco", rotulo: "Preço (R$)", tipo: "number", moeda: true, obrigatorio: true },
    { nome: "quantidade", rotulo: "Quantidade total", tipo: "number", obrigatorio: true },
    { nome: "quantidadeDisponivel", rotulo: "Quantidade disponível", tipo: "number", obrigatorio: true },
    { nome: "lote", rotulo: "Lote", tipo: "text" },
    { nome: "dataInicioVenda", rotulo: "Início das vendas", tipo: "date" },
    { nome: "dataFimVenda", rotulo: "Fim das vendas", tipo: "date" },
    {
      nome: "status",
      rotulo: "Status",
      tipo: "select",
      opcoes: ["Disponível", "Esgotado", "Encerrado"],
      obrigatorio: true,
    },
  ],
};
