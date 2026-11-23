// Cadastra 5 documentos de exemplo em cada coleção (só ADICIONA, nunca apaga nada).
import { criar } from "./crudService";
import { COLECOES } from "../config/colecoes";
import { paraTimestamp } from "../utils";

async function criarVarios(nomeColecao, lista) {
  const ids = [];
  for (const dados of lista) {
    const ref = await criar(nomeColecao, dados);
    ids.push(ref.id);
  }
  return ids;
}

export async function carregarExemplos() {
  const artistasIds = await criarVarios(COLECOES.artistas.colecao, [
    { nome: "Rafael Souza", nomeArtistico: "Rafa & Bruno", generoMusical: "Sertanejo", cidade: "Goiânia", estado: "GO", cache: 80000, duracaoShow: 120, contato: "rafabruno@exemplo.com", descricao: "Dupla sertaneja com hits românticos.", imagem: "" },
    { nome: "Nova Lima", nomeArtistico: "MC Nova", generoMusical: "Funk", cidade: "Rio de Janeiro", estado: "RJ", cache: 50000, duracaoShow: 90, contato: "mcnova@exemplo.com", descricao: "Funk para dançar a noite toda.", imagem: "" },
    { nome: "Banda Eclipse", nomeArtistico: "Eclipse", generoMusical: "Rock", cidade: "Curitiba", estado: "PR", cache: 40000, duracaoShow: 100, contato: "eclipse@exemplo.com", descricao: "Rock autoral com guitarras pesadas.", imagem: "" },
    { nome: "Samba Real", nomeArtistico: "Grupo Samba Real", generoMusical: "Pagode", cidade: "São Paulo", estado: "SP", cache: 60000, duracaoShow: 150, contato: "sambareal@exemplo.com", descricao: "Pagode de roda com clássicos.", imagem: "" },
    { nome: "Paulo Pulse", nomeArtistico: "DJ Pulse", generoMusical: "Música Eletrônica", cidade: "Florianópolis", estado: "SC", cache: 35000, duracaoShow: 180, contato: "djpulse@exemplo.com", descricao: "Set de house e techno.", imagem: "" },
  ]);

  const locaisIds = await criarVarios(COLECOES.local.colecao, [
    { nome: "Arena Central", tipo: "Arena", endereco: "Av. Brasil", numero: "1000", bairro: "Centro", cidade: "Goiânia", estado: "GO", capacidade: 8000, valorAluguel: 30000, acessibilidade: true },
    { nome: "Espaço Rio Live", tipo: "Casa de shows", endereco: "Rua da Música", numero: "250", bairro: "Lapa", cidade: "Rio de Janeiro", estado: "RJ", capacidade: 2500, valorAluguel: 15000, acessibilidade: true },
    { nome: "Rock Hall", tipo: "Casa de shows", endereco: "Rua XV", numero: "88", bairro: "Batel", cidade: "Curitiba", estado: "PR", capacidade: 1800, valorAluguel: 10000, acessibilidade: false },
    { nome: "Clube do Samba", tipo: "Clube", endereco: "Rua Augusta", numero: "420", bairro: "Consolação", cidade: "São Paulo", estado: "SP", capacidade: 3000, valorAluguel: 12000, acessibilidade: true },
    { nome: "Parque das Luzes", tipo: "Parque", endereco: "Av. Beira Mar", numero: "s/n", bairro: "Beira Mar", cidade: "Florianópolis", estado: "SC", capacidade: 10000, valorAluguel: 40000, acessibilidade: true },
  ]);

  const eventosIds = await criarVarios(COLECOES.eventos.colecao, [
    { nome: "Noite Sertaneja", artistaIds: [artistasIds[0]], localId: locaisIds[0], data: paraTimestamp("2026-11-20"), horarioInicio: "21:00", horarioFim: "00:30", genero: "Sertanejo", descricao: "Show com os maiores sucessos da dupla.", status: "Agendado", imagem: "" },
    { nome: "Baile do Nova", artistaIds: [artistasIds[1]], localId: locaisIds[1], data: paraTimestamp("2026-11-28"), horarioInicio: "22:00", horarioFim: "03:00", genero: "Funk", descricao: "Baile funk com participações especiais.", status: "Agendado", imagem: "" },
    { nome: "Eclipse Ao Vivo", artistaIds: [artistasIds[2]], localId: locaisIds[2], data: paraTimestamp("2026-12-05"), horarioInicio: "20:00", horarioFim: "23:00", genero: "Rock", descricao: "Turnê de lançamento do novo álbum.", status: "Agendado", imagem: "" },
    { nome: "Roda de Samba Real", artistaIds: [artistasIds[3]], localId: locaisIds[3], data: paraTimestamp("2026-12-12"), horarioInicio: "16:00", horarioFim: "21:00", genero: "Pagode", descricao: "Tarde de pagode e muito samba.", status: "Esgotado", imagem: "" },
    { nome: "Pulse Sunset", artistaIds: [artistasIds[4]], localId: locaisIds[4], data: paraTimestamp("2027-01-16"), horarioInicio: "18:00", horarioFim: "02:00", genero: "Música Eletrônica", descricao: "Festival ao pôr do sol com DJ Pulse.", status: "Agendado", imagem: "" },
  ]);

  await criarVarios(COLECOES.ingressos.colecao, [
    { eventoId: eventosIds[0], tipo: "Pista", preco: 120, quantidade: 5000, quantidadeDisponivel: 3200, lote: "1º lote", dataInicioVenda: paraTimestamp("2026-10-01"), dataFimVenda: paraTimestamp("2026-11-19"), status: "Disponível" },
    { eventoId: eventosIds[1], tipo: "Camarote", preco: 250, quantidade: 500, quantidadeDisponivel: 180, lote: "1º lote", dataInicioVenda: paraTimestamp("2026-10-05"), dataFimVenda: paraTimestamp("2026-11-27"), status: "Disponível" },
    { eventoId: eventosIds[2], tipo: "Pista", preco: 90, quantidade: 1500, quantidadeDisponivel: 900, lote: "2º lote", dataInicioVenda: paraTimestamp("2026-10-10"), dataFimVenda: paraTimestamp("2026-12-04"), status: "Disponível" },
    { eventoId: eventosIds[3], tipo: "Arquibancada", preco: 70, quantidade: 2500, quantidadeDisponivel: 0, lote: "Lote único", dataInicioVenda: paraTimestamp("2026-09-20"), dataFimVenda: paraTimestamp("2026-12-11"), status: "Esgotado" },
    { eventoId: eventosIds[4], tipo: "Área VIP", preco: 300, quantidade: 800, quantidadeDisponivel: 650, lote: "1º lote", dataInicioVenda: paraTimestamp("2026-11-01"), dataFimVenda: paraTimestamp("2027-01-15"), status: "Disponível" },
  ]);

  await criarVarios(COLECOES.divulgacao.colecao, [
    { nomeCampanha: "Contagem regressiva Sertaneja", eventoId: eventosIds[0], plataforma: "Instagram", tipo: "Anúncio pago", dataInicio: paraTimestamp("2026-10-01"), dataFim: paraTimestamp("2026-11-19"), orcamento: 5000, responsavel: "Marina", status: "Em andamento", observacao: "Foco em público de Goiás." },
    { nomeCampanha: "Desafio do Baile", eventoId: eventosIds[1], plataforma: "TikTok", tipo: "Influenciador", dataInicio: paraTimestamp("2026-10-10"), dataFim: paraTimestamp("2026-11-27"), orcamento: 3500, responsavel: "Carlos", status: "Em andamento", observacao: "" },
    { nomeCampanha: "Lançamento Eclipse", eventoId: eventosIds[2], plataforma: "YouTube", tipo: "Anúncio pago", dataInicio: paraTimestamp("2026-10-15"), dataFim: paraTimestamp("2026-12-04"), orcamento: 4000, responsavel: "Marina", status: "Planejada", observacao: "Usar vídeo do clipe." },
    { nomeCampanha: "Samba na rádio", eventoId: eventosIds[3], plataforma: "Rádio", tipo: "Rádio/TV", dataInicio: paraTimestamp("2026-09-15"), dataFim: paraTimestamp("2026-12-11"), orcamento: 6000, responsavel: "Joana", status: "Concluída", observacao: "Ingressos esgotados." },
    { nomeCampanha: "Pulse Sunset teaser", eventoId: eventosIds[4], plataforma: "Facebook", tipo: "Post orgânico", dataInicio: paraTimestamp("2026-11-01"), dataFim: paraTimestamp("2027-01-15"), orcamento: 1500, responsavel: "Carlos", status: "Planejada", observacao: "" },
  ]);
}