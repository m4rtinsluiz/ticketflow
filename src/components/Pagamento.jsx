import { useState } from "react";
import { formatarMoeda } from "../utils";

// Formulário de pagamento FICTÍCIO: nada digitado aqui é enviado ou guardado em lugar nenhum.

const METODOS = [
  { chave: "credito", rotulo: "Cartão de crédito" },
  { chave: "debito", rotulo: "Cartão de débito" },
  { chave: "pix", rotulo: "Pix" },
];
const MAX_PARCELAS = 6; // sem juros

const soDigitos = (t) => t.replace(/\D/g, "");

function formatarNumero(t) {
  return soDigitos(t).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatarValidade(t) {
  const d = soDigitos(t).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

// "MM/AA" válido e que ainda não venceu (vale até o fim do mês)
function validadeOk(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const mes = Number(m[1]);
  const ano = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return false;
  const hoje = new Date();
  return ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes >= hoje.getMonth() + 1);
}

export default function Pagamento({ total, processando, erro, aoConfirmar, aoVoltar }) {
  const [metodo, setMetodo] = useState("credito");
  const [numero, setNumero] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [erros, setErros] = useState({});

  const ehCartao = metodo !== "pix";

  function enviar(e) {
    e.preventDefault();
    if (processando) return;

    const novosErros = {};
    if (ehCartao) {
      const digitos = soDigitos(numero);
      if (digitos.length < 13) novosErros.numero = "Número do cartão incompleto";
      if (!nomeCartao.trim()) novosErros.nomeCartao = "Digite o nome impresso no cartão";
      if (!validadeOk(validade)) novosErros.validade = "Validade inválida";
      if (cvv.length < 3) novosErros.cvv = "CVV inválido";
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    // só o necessário para o comprovante; o número completo e o CVV nunca saem daqui
    aoConfirmar({
      metodo,
      parcelas: metodo === "credito" ? Number(parcelas) : 1,
      finalCartao: ehCartao ? soDigitos(numero).slice(-4) : null,
    });
  }

  return (
    <form className="pagamento" onSubmit={enviar} noValidate>
      <h3>Forma de pagamento</h3>

      <div className="pagamento-opcoes" role="radiogroup" aria-label="Forma de pagamento">
        {METODOS.map((m) => (
          <label
            key={m.chave}
            className={`pagamento-opcao ${metodo === m.chave ? "ativa" : ""}`}
          >
            <input
              type="radio"
              name="metodo"
              value={m.chave}
              checked={metodo === m.chave}
              onChange={() => setMetodo(m.chave)}
              disabled={processando}
            />
            {m.rotulo}
          </label>
        ))}
      </div>

      {ehCartao ? (
        <div className="pagamento-grade">
          <div className="campo pagamento-largo">
            <label htmlFor="pag-numero">Número do cartão</label>
            <input
              id="pag-numero"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0000 0000 0000 0000"
              value={numero}
              onChange={(e) => setNumero(formatarNumero(e.target.value))}
              disabled={processando}
            />
            {erros.numero && <span className="erro-campo">{erros.numero}</span>}
          </div>

          <div className="campo pagamento-largo">
            <label htmlFor="pag-nome">Nome no cartão</label>
            <input
              id="pag-nome"
              type="text"
              autoComplete="off"
              value={nomeCartao}
              onChange={(e) => setNomeCartao(e.target.value)}
              disabled={processando}
            />
            {erros.nomeCartao && <span className="erro-campo">{erros.nomeCartao}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pag-validade">Validade</label>
            <input
              id="pag-validade"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="MM/AA"
              value={validade}
              onChange={(e) => setValidade(formatarValidade(e.target.value))}
              disabled={processando}
            />
            {erros.validade && <span className="erro-campo">{erros.validade}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pag-cvv">CVV</label>
            <input
              id="pag-cvv"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(soDigitos(e.target.value).slice(0, 4))}
              disabled={processando}
            />
            {erros.cvv && <span className="erro-campo">{erros.cvv}</span>}
          </div>

          {metodo === "credito" && (
            <div className="campo pagamento-largo">
              <label htmlFor="pag-parcelas">Parcelas</label>
              <select
                id="pag-parcelas"
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                disabled={processando}
              >
                {Array.from({ length: MAX_PARCELAS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}x de R$ {formatarMoeda(total / n) || "0,00"} sem juros
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <p className="dica">
          Pagamento via Pix simulado: ao confirmar, ele é aprovado na hora e o seu ingresso é
          gerado.
        </p>
      )}

      {erro && <div className="aviso aviso-erro">{erro}</div>}

      <div className="formulario-botoes">
        <button type="submit" className="btn btn-primario" disabled={processando}>
          {processando ? "Processando pagamento..." : `Pagar R$ ${formatarMoeda(total) || "0,00"}`}
        </button>
        <button type="button" className="btn" onClick={aoVoltar} disabled={processando}>
          Voltar
        </button>
      </div>
    </form>
  );
}
