import QRCodeFake from "./QRCodeFake";
import { formatarData, formatarMoeda } from "../utils";

function textoDoPagamento(p) {
  if (p.metodo === "pix") return "Pix";
  if (p.metodo === "debito") return `Débito (final ${p.finalCartao})`;
  return `Crédito ${p.parcelas}x (final ${p.finalCartao})`;
}

// Comprovante com o "ingresso" e o QR Code fictício, mostrado depois do pagamento aprovado.
export default function IngressoQR({ pedido, evento, aoNovaCompra }) {
  return (
    <div className="ingresso-pronto">
      <div className="aviso aviso-sucesso">
        <strong>Pagamento aprovado!</strong> Seu ingresso foi gerado.
      </div>

      <div className="ingresso-qr">
        <div className="ingresso-qr-dados">
          <h3>{evento.nome}</h3>
          <p className="card-artista">{evento.artistaNome}</p>
          <p>
            {formatarData(evento.data)}
            {evento.horarioInicio ? ` às ${evento.horarioInicio}` : ""}
          </p>
          <p className="dica">{evento.localTexto}</p>

          <ul>
            {pedido.itens.map((i) => (
              <li key={i.id}>
                {i.qtd}x {i.tipo}
                {i.lote ? ` (${i.lote})` : ""}
              </li>
            ))}
          </ul>

          <p className="dica">
            {textoDoPagamento(pedido.pagamento)} · Total R$ {formatarMoeda(pedido.total) || "0,00"}
          </p>
        </div>

        <div className="ingresso-qr-codigo">
          <QRCodeFake valor={`TICKETFLOW|${pedido.codigo}|${evento.id}`} />
          <strong>{pedido.codigo}</strong>
        </div>
      </div>

      

      <button className="btn" onClick={aoNovaCompra}>
        Comprar mais ingressos
      </button>
    </div>
  );
}
