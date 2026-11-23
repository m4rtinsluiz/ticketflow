// Campos do formulário e colunas da tabela da coleção "divulgacao".

export const divulgacaoConfig = {
  chave: "divulgacao",
  colecao: "divulgacao",
  menu: "Divulgação",
  titulo: "Divulgação",
  campoNome: "nomeCampanha",
  colunas: ["nomeCampanha", "eventoId", "plataforma", "dataInicio", "orcamento", "status"],
  campos: [
    { nome: "nomeCampanha", rotulo: "Nome da campanha", tipo: "text", obrigatorio: true },
    { nome: "eventoId", rotulo: "Evento", tipo: "ref", ref: "eventos", obrigatorio: true },
    {
      nome: "plataforma",
      rotulo: "Plataforma",
      tipo: "select",
      opcoes: ["Instagram", "TikTok", "Facebook", "YouTube", "Google", "Rádio"],
      obrigatorio: true,
    },
    {
      nome: "tipo",
      rotulo: "Tipo",
      tipo: "select",
      opcoes: ["Anúncio pago", "Post orgânico", "Influenciador", "Rádio/TV"],
    },
    { nome: "dataInicio", rotulo: "Data de início", tipo: "date" },
    { nome: "dataFim", rotulo: "Data de término", tipo: "date" },
    { nome: "orcamento", rotulo: "Orçamento (R$)", tipo: "number", moeda: true },
    { nome: "responsavel", rotulo: "Responsável", tipo: "text" },
    {
      nome: "status",
      rotulo: "Status",
      tipo: "select",
      opcoes: ["Planejada", "Em andamento", "Concluída"],
      obrigatorio: true,
    },
    { nome: "observacao", rotulo: "Observação", tipo: "textarea" },
  ],
};
