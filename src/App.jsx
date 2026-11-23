import { useEffect, useState } from "react";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import { observarUsuario, sair, buscarPapel, PAPEL_ADMIN, PAPEL_COMUM } from "./services/authService";
import Home from "./pages/Home";
import EventoDetalhe from "./pages/EventoDetalhe";
import Eventos from "./pages/Eventos";
import Artistas from "./pages/Artistas";
import Locais from "./pages/Locais";
import Ingressos from "./pages/Ingressos";
import Divulgacao from "./pages/Divulgacao";

// chave do menu -> tela correspondente (as chaves são as mesmas de ORDEM_MENU)
const PAGINAS = {
  eventos: Eventos,
  artistas: Artistas,
  local: Locais,
  ingressos: Ingressos,
  divulgacao: Divulgacao,
};

export default function App() {
  
  const [usuario, setUsuario] = useState(null);
  const [verificandoLogin, setVerificandoLogin] = useState(true);

  const [papel, setPapel] = useState(PAPEL_COMUM);
 
  const [pagina, setPagina] = useState("home");
  const [busca, setBusca] = useState("");

  const [eventoParaEditar, setEventoParaEditar] = useState(null);
 
  const [eventoAberto, setEventoAberto] = useState(null);


  useEffect(() => {
    return observarUsuario(async (u) => {
      setPapel(u ? await buscarPapel(u.uid) : PAPEL_COMUM);
      setUsuario(u);
      setVerificandoLogin(false);
    });
  }, []);

  const ehAdmin = papel === PAPEL_ADMIN;

  function editarEvento(evento) {
    if (!ehAdmin) return; 
    setEventoParaEditar(evento.id);
    setPagina("eventos");
  }

  function abrirEvento(evento) {
    setEventoAberto(evento);
    setPagina("evento");
    window.scrollTo({ top: 0 });
  }


  function irPara(destino) {
    setEventoParaEditar(null);
    setEventoAberto(null);
    setPagina(destino);
  }

  async function aoSair() {
    await sair();
    setPagina("home");
    setBusca("");
    setEventoParaEditar(null);
    setEventoAberto(null);
    setPapel(PAPEL_COMUM);
  }

  // enquanto o Firebase confirma se já existe login salvo, não mostra nada do site
  if (verificandoLogin) {
    return (
      <main className="conteudo">
        <Loading texto="Verificando acesso..." />
      </main>
    );
  }

  // sem usuário logado, só a tela de login
  if (!usuario) {
    return <Login />;
  }

  const Pagina = PAGINAS[pagina];

  return (
    <>
      <Header
        pagina={pagina}
        irPara={irPara}
        busca={busca}
        setBusca={setBusca}
        usuario={usuario}
        ehAdmin={ehAdmin}
        aoSair={aoSair}
      />
      <main className="conteudo">
        {pagina === "home" ? (
          <Home
            busca={busca}
            aoClicarEvento={ehAdmin ? editarEvento : abrirEvento}
            dicaCard={ehAdmin ? "Clique para editar este evento" : "Clique para ver os detalhes do evento"}
          />
        ) : pagina === "evento" ? (
          <EventoDetalhe evento={eventoAberto} aoVoltar={() => irPara("home")} />
        ) : (
          <Pagina
            key={pagina}
            somenteLeitura={!ehAdmin}
            idParaEditar={pagina === "eventos" ? eventoParaEditar : null}
            aoAbrirEdicao={() => setEventoParaEditar(null)}
          />
        )}
      </main>
    </>
  );
}
