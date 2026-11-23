// Campos do formulário e colunas da tabela da coleção "eventos".
import { GENEROS } from "./generos";

export const eventosConfig = {
  chave: "eventos",
  colecao: "eventos",
  menu: "Eventos",
  titulo: "Eventos",
  campoNome: "nome",
  colunas: ["nome", "artistaIds", "localId", "data", "horarioInicio",  "genero", "status"],
  campos: [
    { nome: "nome", rotulo: "Nome do evento", tipo: "text", obrigatorio: true },
    { nome: "genero", rotulo: "Gênero", tipo: "select", opcoes: GENEROS, obrigatorio: true },
    {
      nome: "artistaIds",
      rotulo: "Artistas",
      tipo: "refs",
      ref: "artistas",
      obrigatorio: true,
      // só mostra artistas cujo "generoMusical" seja igual ao "genero" escolhido no formulário
      filtrarPor: { campoForm: "genero", campoRef: "generoMusical" },
    },
    { nome: "localId", rotulo: "Local", tipo: "ref", ref: "local", obrigatorio: true },
    { nome: "data", rotulo: "Data", tipo: "date", obrigatorio: true },
    { nome: "horarioInicio", rotulo: "Horário", tipo: "time", obrigatorio: true },
    { nome: "horarioFim", rotulo: "Horário de término", tipo: "time" },
    {
      nome: "status",
      rotulo: "Status",
      tipo: "select",
      opcoes: ["Agendado", "Esgotado", "Encerrado", "Cancelado"],
      obrigatorio: true,
    },
    { nome: "imagem", rotulo: "Link da imagem (URL)", tipo: "text" },
    { nome: "descricao", rotulo: "Descrição", tipo: "textarea" },
  ],
};
