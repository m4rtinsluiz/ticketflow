import { useState } from "react";
import { formatarData } from "../utils";

export default function EventCard({ evento, aoClicar, dica }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const temImagem = evento.imagem && !imagemFalhou;
  const inicial = (evento.nome || "?").slice(0, 2).toUpperCase();
  const aviso = evento.status === "Esgotado" || evento.status === "Encerrado";

  return (
    <article
      className={`card ${aoClicar ? "card-clicavel" : ""}`}
      onClick={aoClicar ? () => aoClicar(evento) : undefined}
      onKeyDown={
        aoClicar
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                aoClicar(evento);
              }
            }
          : undefined
      }
      role={aoClicar ? "button" : undefined}
      tabIndex={aoClicar ? 0 : undefined}
      title={aoClicar ? dica : undefined}
    >
      <div className="card-imagem">
        {temImagem ? (
          <img src={evento.imagem} alt={evento.nome} onError={() => setImagemFalhou(true)} />
        ) : (
          <div className="card-sem-imagem">{inicial}</div>
        )}
        {aviso && <span className="selo">{evento.status}</span>}
      </div>
      <div className="card-corpo">
        <h3>{evento.nome}</h3>
        <p className="card-artista">{evento.artistaNome}</p>
        <p>
          {formatarData(evento.data)}
          {evento.horarioInicio ? ` às ${evento.horarioInicio}` : ""}
        </p>
        <p className="card-local">{evento.localTexto}</p>
      </div>
    </article>
  );
}
