// Campos do formulário e colunas da tabela da coleção "local".

export const localConfig = {
  chave: "local",
  colecao: "local",
  menu: "Locais",
  titulo: "Locais",
  campoNome: "nome",
  colunas: ["nome", "tipo", "cidade", "estado", "capacidade", "acessibilidade"],
  campos: [
    { nome: "nome", rotulo: "Nome do local", tipo: "text", obrigatorio: true },
    {
      nome: "tipo",
      rotulo: "Tipo",
      tipo: "select",
      opcoes: ["Casa de shows", "Arena", "Estádio", "Bar", "Clube", "Parque"],
      obrigatorio: true,
    },
    { nome: "endereco", rotulo: "Endereço", tipo: "text" },
    { nome: "numero", rotulo: "Número", tipo: "text" },
    { nome: "bairro", rotulo: "Bairro", tipo: "text" },
    { nome: "cidade", rotulo: "Cidade", tipo: "text", obrigatorio: true },
    { nome: "estado", rotulo: "Estado (UF)", tipo: "text" },
    { nome: "capacidade", rotulo: "Capacidade (pessoas)", tipo: "number", obrigatorio: true },
    { nome: "valorAluguel", rotulo: "Valor do aluguel (R$)", tipo: "number", moeda: true },
    { nome: "acessibilidade", rotulo: "Possui acessibilidade", tipo: "checkbox" },
  ],
};
