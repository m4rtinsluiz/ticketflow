// Campos do formulário e colunas da tabela da coleção "artistas".
import { GENEROS } from "./generos";

export const artistasConfig = {
  chave: "artistas",
  colecao: "artistas",
  menu: "Artistas",
  titulo: "Artistas",
  campoNome: "nomeArtistico",
  colunas: ["nomeArtistico", "generoMusical", "cidade", "cache", "duracaoShow"],
  campos: [
    { nome: "nome", rotulo: "Nome completo", tipo: "text", obrigatorio: true },
    { nome: "nomeArtistico", rotulo: "Nome artístico", tipo: "text", obrigatorio: true },
    { nome: "generoMusical", rotulo: "Gênero musical", tipo: "select", opcoes: GENEROS, obrigatorio: true },
    { nome: "cidade", rotulo: "Cidade", tipo: "text" },
    { nome: "estado", rotulo: "Estado (UF)", tipo: "text" },
    { nome: "cache", rotulo: "Cachê (R$)", tipo: "number", moeda: true,},
    { nome: "duracaoShow", rotulo: "Duração do show (minutos)", tipo: "number" },
    { nome: "contato", rotulo: "Contato", tipo: "text", placeholder: "Digite o e-mail"},
    { nome: "imagem", rotulo: "Link da imagem (URL)", tipo: "text" },
    { nome: "descricao", rotulo: "Descrição", tipo: "textarea" },
  ],
};
