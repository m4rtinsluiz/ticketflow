import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Pagamento from "../components/Pagamento";
import IngressoQR from "../components/IngressoQR";
import { listar } from "../services/crudService";
import { descontarEstoque } from "../services/compraService";
import { COLECOES } from "../config/colecoes";
import { formatarData, formatarMoeda } from "../utils";

// máximo de ingressos por tipo em cada compra (além do estoque disponível)
const MAX_POR_TIPO = 6;

// o ingresso pode ser comprado se está "Disponível" e ainda tem estoque
function podeComprar(ingresso) {
  return ingresso.status === "Disponível" && Number(ingresso.quantidadeDisponivel) > 0;
}

// código do pedido, ex.: TF-K7M2-X9QA (é o que aparece embaixo do QR Code)
function gerarCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const sorteio = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => letras[b % letras.length]);
  return `TF-${sorteio.slice(0, 4).join("")}-${sorteio.slice(4).join("")}`;
}

export default function EventoDetalhe({ evento, aoVoltar }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const [ingressos, setIngressos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [quantidades, setQuantidades] = useState({}); // id do ingresso -> quantidade escolhida
  // etapas da compra: "escolha" -> "pagamento" -> "concluido"
  const [etapa, setEtapa] = useState("escolha");
  const [processando, setProcessando] = useState(false);
  const [erroCompra, setErroCompra] = useState("");
  const [pedido, setPedido] = useState(null); // preenchido quando o pagamento é aprovado

  const temImagem = evento.imagem && !imagemFalhou;
  const inicial = (evento.nome || "?").slice(0, 2).toUpperCase();
  const vendaAberta = evento.status === "Agendado";

  async function carregarIngressos() {
    try {
      const todos = await listar(COLECOES.ingressos.colecao);
      const doEvento = todos
        .filter((i) => i.eventoId === evento.id)
        .sort((a, b) => (Number(a.preco) || 0) - (Number(b.preco) || 0));
      setIngressos(doEvento);
      setErro("");
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os ingressos deste evento.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarIngressos();
  }, [evento.id]);

  function mudarQuantidade(ingresso, delta) {
    const maximo = Math.min(MAX_POR_TIPO, Number(ingresso.quantidadeDisponivel) || 0);
    setQuantidades((anterior) => {
      const atual = anterior[ingresso.id] || 0;
      const nova = Math.max(0, Math.min(maximo, atual + delta));
      return { ...anterior, [ingresso.id]: nova };
    });
  }

  // itens escolhidos e total da compra
  const itens = ingressos
    .filter((i) => (quantidades[i.id] || 0) > 0)
    .map((i) => {
      const qtd = quantidades[i.id];
      const preco = Number(i.preco) || 0;
      return { id: i.id, tipo: i.tipo, lote: i.lote, qtd, subtotal: qtd * preco };
    });
  const totalIngressos = itens.reduce((soma, i) => soma + i.qtd, 0);
  const total = itens.reduce((soma, i) => soma + i.subtotal, 0);

  function irParaPagamento() {
    setErroCompra("");
    setEtapa("pagamento");
  }

  async function confirmarPagamento(pagamento) {
    setProcessando(true);
    setErroCompra("");
    try {
      // pequena espera só para simular a aprovação do pagamento
      await new Promise((resolver) => setTimeout(resolver, 1500));

      // desconta do estoque de verdade (se algo der errado aqui, nada é descontado)
      await descontarEstoque(itens.map((i) => ({ id: i.id, qtd: i.qtd })));

      setPedido({ codigo: gerarCodigo(), itens, total, totalIngressos, pagamento });
      setQuantidades({});
      setEtapa("concluido");
      carregarIngressos(); // atualiza o estoque mostrado na tela
    } catch (e) {
      console.error(e);
      if (e.code === "estoque-insuficiente") {
        setErroCompra(
          "Alguns ingressos acabaram enquanto você comprava. Nenhuma cobrança foi feita; revise as quantidades."
        );
        setQuantidades({});
        setEtapa("escolha");
        carregarIngressos();
      } else {
        setErroCompra("Não foi possível finalizar a compra. Nenhuma cobrança foi feita; tente novamente.");
      }
    } finally {
      setProcessando(false);
    }
  }

  function novaCompra() {
    setPedido(null);
    setErroCompra("");
    setEtapa("escolha");
  }

  return (
    <section className="evento-detalhe">
      <button className="btn evento-voltar" onClick={aoVoltar} disabled={processando}>
        ← Voltar aos eventos
      </button>

      <div className="evento-layout">
        {/* esquerda: capa do evento */}
        <div className="evento-capa">
          {temImagem ? (
            <img src={evento.imagem} alt={evento.nome} onError={() => setImagemFalhou(true)} />
          ) : (
            <div className="card-sem-imagem">{inicial}</div>
          )}
        </div>

        {/* direita: descrição e compra */}
        <div className="evento-info">
          <div>
            <h1>{evento.nome}</h1>
            <p className="card-artista">{evento.artistaNome}</p>
          </div>

          <dl className="evento-dados">
            <div>
              <dt>Data</dt>
              <dd>
                {formatarData(evento.data)}
                {evento.horarioInicio ? ` às ${evento.horarioInicio}` : ""}
                {evento.horarioFim ? ` (término ${evento.horarioFim})` : ""}
              </dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>{evento.localTexto}</dd>
            </div>
            {evento.genero && (
              <div>
                <dt>Gênero</dt>
                <dd>{evento.genero}</dd>
              </div>
            )}
            <div>
              <dt>Situação</dt>
              <dd>{evento.status}</dd>
            </div>
          </dl>

          <div>
            <h2>Sobre o evento</h2>
            <p className="evento-descricao">
              {evento.descricao || "Este evento ainda não tem uma descrição."}
            </p>
          </div>

          <div className="compra">
            {etapa === "concluido" && pedido ? (
              <IngressoQR pedido={pedido} evento={evento} aoNovaCompra={novaCompra} />
            ) : (
              <>
                <h2>Ingressos</h2>
                

                {carregando && <Loading texto="Carregando ingressos..." />}
                {!carregando && erro && <div className="aviso aviso-erro">{erro}</div>}

                {!carregando && !erro && !vendaAberta && (
                  <div className="aviso aviso-erro">
                    As vendas não estão abertas: evento {evento.status.toLowerCase()}.
                  </div>
                )}

                {!carregando && !erro && ingressos.length === 0 && (
                  <p className="vazio">Ainda não há ingressos cadastrados para este evento.</p>
                )}

                {!carregando && !erro && ingressos.length > 0 && etapa === "escolha" && (
                  <>
                    <ul className="ingressos-lista">
                      {ingressos.map((ing) => {
                        const liberado = vendaAberta && podeComprar(ing);
                        const qtd = quantidades[ing.id] || 0;
                        const maximo = Math.min(MAX_POR_TIPO, Number(ing.quantidadeDisponivel) || 0);
                        return (
                          <li key={ing.id} className={`ingresso ${liberado ? "" : "ingresso-indisponivel"}`}>
                            <div className="ingresso-nome">
                              <strong>{ing.tipo}</strong>
                              <span className="dica">
                                {ing.lote ? `${ing.lote} · ` : ""}
                                {podeComprar(ing)
                                  ? `${ing.quantidadeDisponivel} disponíveis`
                                  : ing.status === "Disponível"
                                  ? "Esgotado"
                                  : ing.status}
                              </span>
                            </div>
                            <span className="ingresso-preco">R$ {formatarMoeda(ing.preco) || "0,00"}</span>
                            <div className="quantidade">
                              <button
                                className="btn"
                                onClick={() => mudarQuantidade(ing, -1)}
                                disabled={!liberado || qtd === 0}
                                aria-label={`Diminuir ingressos ${ing.tipo}`}
                              >
                                −
                              </button>
                              <span aria-live="polite">{qtd}</span>
                              <button
                                className="btn"
                                onClick={() => mudarQuantidade(ing, 1)}
                                disabled={!liberado || qtd >= maximo}
                                aria-label={`Aumentar ingressos ${ing.tipo}`}
                              >
                                +
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="compra-total">
                      <span>
                        Total ({totalIngressos} {totalIngressos === 1 ? "ingresso" : "ingressos"})
                      </span>
                      <strong>R$ {formatarMoeda(total) || "0,00"}</strong>
                    </div>

                    {erroCompra && <div className="aviso aviso-erro">{erroCompra}</div>}

                    <button
                      className="btn btn-primario"
                      onClick={irParaPagamento}
                      disabled={totalIngressos === 0}
                    >
                      Ir para o pagamento
                    </button>
                  </>
                )}

                {!carregando && !erro && etapa === "pagamento" && (
                  <>
                    <ul className="compra-resumo-lista">
                      {itens.map((i) => (
                        <li key={i.id}>
                          <span>
                            {i.qtd}x {i.tipo}
                            {i.lote ? ` (${i.lote})` : ""}
                          </span>
                          <span>R$ {formatarMoeda(i.subtotal) || "0,00"}</span>
                        </li>
                      ))}
                    </ul>
                    <Pagamento
                      total={total}
                      processando={processando}
                      erro={erroCompra}
                      aoConfirmar={confirmarPagamento}
                      aoVoltar={() => setEtapa("escolha")}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
