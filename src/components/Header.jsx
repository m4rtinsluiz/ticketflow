import { COLECOES, ORDEM_MENU } from "../config/colecoes";

export default function Header({ pagina, irPara, busca, setBusca, usuario, ehAdmin, aoSair }) {
  function aoDigitar(e) {
    setBusca(e.target.value);
    irPara("home"); // a busca sempre mostra os resultados na página inicial
  }

  return (
    <header className="header">
      <div className="header-topo">
        <button className="logo" onClick={() => irPara("home")}>
          TicketFlow
        </button>
        <input
          className="busca"
          type="search"
          placeholder="Buscar por evento ou artista"
          value={busca}
          onChange={aoDigitar}
        />
        <div className="header-usuario">
          <span className={`papel ${ehAdmin ? "papel-admin" : "papel-comum"}`}>
            {ehAdmin ? "Administrador" : "Visualização"}
          </span>
          <span className="header-email" title={usuario?.email}>
            {usuario?.email}
          </span>
          <button className="btn" onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
      <nav className="menu">
        <button className={pagina === "home" ? "ativo" : ""} onClick={() => irPara("home")}>
          Início
        </button>
        {ORDEM_MENU.map((chave) => (
          <button
            key={chave}
            className={pagina === chave ? "ativo" : ""}
            onClick={() => irPara(chave)}
          >
            {COLECOES[chave].menu}
          </button>
        ))}
      </nav>
    </header>
  );
}
