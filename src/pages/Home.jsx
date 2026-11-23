import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import { listar } from "../services/crudService";
import { carregarExemplos } from "../services/seedService";
import { COLECOES, GENEROS } from "../config/colecoes";
import { normalizar } from "../utils";

export default function Home({ busca, aoClicarEvento, dicaCard }) {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [listaEventos, artistas, locais] = await Promise.all([
        listar(COLECOES.eventos.colecao),
        listar(COLECOES.artistas.colecao),
        listar(COLECOES.local.colecao),
      ]);

      // junta cada evento com o nome do artista e do local (pelos IDs)
      const completos = listaEventos.map((ev) => {
        // aceita o formato novo (artistaIds = lista) e o antigo (artistaId = um só)
        const ids = Array.isArray(ev.artistaIds)
          ? ev.artistaIds
          : ev.artistaId
          ? [ev.artistaId]
          : [];
        const nomes = ids
          .map((id) => artistas.find((a) => a.id === id))
          .filter(Boolean)
          .map((a) => a.nomeArtistico);
        const local = locais.find((l) => l.id === ev.localId);
        return {
          ...ev,
          artistaNome: nomes.length > 0 ? nomes.join(", ") : "Artista a confirmar",
          localTexto: local ? `${local.nome} - ${local.cidade}` : "Local a confirmar",
        };
      });
      setEventos(completos);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os eventos. Verifique a conexão e as regras do Firestore.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function popularExemplos() {
    const ok = window.confirm(
      "Isso vai ADICIONAR 5 documentos de exemplo em cada coleção. Nada será apagado. Continuar?"
    );
    if (!ok) return;
    try {
      setCarregando(true);
      await carregarExemplos();
      setAviso("Dados de exemplo cadastrados.");
      await carregar();
    } catch (e) {
      console.error(e);
      setErro("Erro ao cadastrar os exemplos.");
      setCarregando(false);
    }
  }

  // filtra pela busca (nome do evento ou do artista) e esconde cancelados
  const termo = normalizar(busca);
  const filtrados = eventos
    .filter((ev) => ev.status !== "Cancelado")
    .filter(
      (ev) => normalizar(ev.nome).includes(termo) || normalizar(ev.artistaNome).includes(termo)
    );

  // agrupa por gênero
  const grupos = {};
  filtrados.forEach((ev) => {
    const genero = ev.genero || "Outros";
    if (!grupos[genero]) grupos[genero] = [];
    grupos[genero].push(ev);
  });
  const generosExibidos = [
    ...GENEROS.filter((g) => grupos[g]),
    ...Object.keys(grupos).filter((g) => !GENEROS.includes(g)),
  ];

  return (
    <div>
      {aviso && <div className="aviso aviso-sucesso">{aviso}</div>}
      {carregando && <Loading texto="Carregando eventos..." />}
      {!carregando && erro && <div className="aviso aviso-erro">{erro}</div>}

      {!carregando && !erro && eventos.length === 0 && (
        <p className="vazio">
          Nenhum evento cadastrado.
        </p>
      )}

      {!carregando && !erro && eventos.length > 0 && filtrados.length === 0 && (
        <p className="vazio">Nenhum evento encontrado para "{busca}".</p>
      )}

      {!carregando &&
        generosExibidos.map((genero) => (
          <section key={genero} className="secao-genero">
            <h2>{genero === "Outros" ? "Outros shows" : `Shows de ${genero}`}</h2>
            <div className="grade-cards">
              {grupos[genero].map((ev) => (
                <EventCard key={ev.id} evento={ev} aoClicar={aoClicarEvento} dica={dicaCard} />
              ))}
            </div>
          </section>
        ))}

      
    </div>
  );
}
