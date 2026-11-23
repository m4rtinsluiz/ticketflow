import { useEffect, useState } from "react";
import { listar, criar, atualizar, excluir } from "../services/crudService";
import { COLECOES } from "../config/colecoes";
import { paraTimestamp, paraInput, formatarData, formatarMoeda } from "../utils";
import Loading from "./Loading";

// Cria um formulário com todos os campos vazios
function formularioVazio(campos) {
  const f = {};

  campos.forEach((c) => {
    if (c.tipo === "checkbox") {
      f[c.nome] = false;
    } else if (c.tipo === "refs") {
      f[c.nome] = [];
    } else {
      f[c.nome] = "";
    }
  });

  return f;
}

export default function CrudPage({ config, idParaEditar, aoAbrirEdicao, somenteLeitura = false }) {
  const [itens, setItens] = useState([]);
  const [opcoes, setOpcoes] = useState({}); // documentos das coleções relacionadas
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", texto }
  const [form, setForm] = useState(null); // null = formulário fechado
  const [editandoId, setEditandoId] = useState(null);
  const [errosCampos, setErrosCampos] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [listaArtistasAberta, setListaArtistasAberta] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listar(config.colecao);
      const refs = {};
      for (const campo of config.campos) {
        if (
  (campo.tipo === "ref" || campo.tipo === "refs") &&
  !refs[campo.ref]
) {
          refs[campo.ref] = await listar(COLECOES[campo.ref].colecao);
        }
      }
      setItens(lista);
      setOpcoes(refs);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os dados. Verifique a conexão e as regras do Firestore.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // Veio de um card da Home: assim que a lista carregar, abre a edição desse item
  useEffect(() => {
    if (!idParaEditar || carregando) return;
    const item = itens.find((i) => i.id === idParaEditar);
    if (item && !somenteLeitura) {
      abrirEdicao(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (aoAbrirEdicao) aoAbrirEdicao(); // consome o pedido (também se o item não existir mais)
  }, [idParaEditar, carregando, itens]);

  // Descobre o nome para mostrar a partir do ID guardado (ex.: artistaId -> nome do artista)
  function nomeDaReferencia(campo, id) {
    const lista = opcoes[campo.ref] || [];
    const encontrado = lista.find((i) => i.id === id);
    return encontrado ? encontrado[COLECOES[campo.ref].campoNome] : "(não encontrado)";
  }

  function textoDaCelula(campo, valor) {
    if (valor === undefined || valor === null || valor === "") return "-";
    if (campo.tipo === "ref") {
  return nomeDaReferencia(campo, valor);
}

if (campo.tipo === "refs") {
  if (!Array.isArray(valor) || valor.length === 0) {
    return "-";
  }

  return valor
    .map((id) => nomeDaReferencia({ ref: campo.ref }, id))
    .join(", ");
}
    if (campo.tipo === "date") return formatarData(valor);
    if (campo.tipo === "checkbox") return valor ? "Sim" : "Não";
    if (campo.moeda) return formatarMoeda(valor);
    return String(valor);
  }

  function abrirNovo() {
    if (somenteLeitura) return;
    setForm(formularioVazio(config.campos));
    setEditandoId(null);
    setErrosCampos({});
    setAviso(null);
  }

  function abrirEdicao(item) {
    if (somenteLeitura) return;
    const f = {};
    config.campos.forEach((c) => {
      const valor = item[c.nome];
     if (c.tipo === "date") {
  f[c.nome] = paraInput(valor);
} else if (c.tipo === "checkbox") {
  f[c.nome] = Boolean(valor);
} else if (c.tipo === "refs") {
  f[c.nome] = Array.isArray(valor) ? valor : [];
} else {
  f[c.nome] = valor === undefined || valor === null ? "" : valor;
}
    });
    setForm(f);
    setEditandoId(item.id);
    setErrosCampos({});
    setAviso(null);
  }

  function fecharFormulario() {
    setForm(null);
    setEditandoId(null);
  }

  // Atualiza o valor de um campo do formulário (texto, número, data, select, checkbox...)
  function mudarCampo(campo, e) {
    const valor = campo.tipo === "checkbox" ? e.target.checked : e.target.value;

    setForm((anterior) => {
      const novo = { ...anterior, [campo.nome]: valor };

      // Se outro campo (ex.: artistas) é filtrado por este, tira da seleção
      // quem não pertence mais ao filtro (ex.: trocou o gênero do evento).
      config.campos.forEach((c) => {
        if (c.tipo === "refs" && c.filtrarPor && c.filtrarPor.campoForm === campo.nome) {
          const permitidos = opcoesFiltradas(c, novo).map((o) => o.id);
          novo[c.nome] = (novo[c.nome] || []).filter((id) => permitidos.includes(id));
        }
      });

      return novo;
    });
  }

  // Opções de um campo ref/refs; aplica o filtro (se existir) com base no formulário
  function opcoesFiltradas(campo, formAtual) {
    const todas = opcoes[campo.ref] || [];
    if (!campo.filtrarPor) return todas;

    const escolhido = formAtual[campo.filtrarPor.campoForm];
    if (!escolhido) return todas; // nada escolhido -> mostra todos

    return todas.filter((o) => o[campo.filtrarPor.campoRef] === escolhido);
  }

  function mudarReferenciaMultipla(campo, id, marcado) {
  const selecionados = form[campo.nome] || [];

  const novosSelecionados = marcado
    ? [...selecionados, id]
    : selecionados.filter((itemId) => itemId !== id);

  setForm({
    ...form,
    [campo.nome]: novosSelecionados,
  });
}

  async function salvar(e) {
    e.preventDefault();
    if (somenteLeitura) return;

    // validação dos campos obrigatórios
    const novosErros = {};
    config.campos.forEach((c) => {
   if (c.obrigatorio && c.tipo === "refs") {
  if (!Array.isArray(form[c.nome]) || form[c.nome].length === 0) {
    novosErros[c.nome] = "Selecione pelo menos um artista";
  }
} else if (
  c.obrigatorio &&
  c.tipo !== "checkbox" &&
  String(form[c.nome]).trim() === ""
) {
  novosErros[c.nome] = "Campo obrigatório";
}
    });
    setErrosCampos(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    // converte os valores do formulário para os tipos do banco
    const dados = {};
    config.campos.forEach((c) => {
      const v = form[c.nome];
      if (c.tipo === "number") {
  const numero = Number(String(v).replace(",", "."));
  dados[c.nome] = String(v).trim() === "" || Number.isNaN(numero) ? null : numero;
} else if (c.tipo === "date") {
  dados[c.nome] = paraTimestamp(v);
} else if (c.tipo === "checkbox") {
  dados[c.nome] = Boolean(v);
} else if (c.tipo === "refs") {
  dados[c.nome] = Array.isArray(v) ? v : [];
} else {
  dados[c.nome] = String(v).trim();
}
    });

    setSalvando(true);
    try {
      if (editandoId) {
        await atualizar(config.colecao, editandoId, dados);
        setAviso({ tipo: "sucesso", texto: "Registro atualizado com sucesso." });
      } else {
        await criar(config.colecao, dados);
        setAviso({ tipo: "sucesso", texto: "Registro cadastrado com sucesso." });
      }
      fecharFormulario();
      await carregar();
    } catch (err) {
      console.error(err);
      setAviso({ tipo: "erro", texto: "Erro ao salvar. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  }

  async function remover(item) {
    if (somenteLeitura) return;
    const nome = item[config.campoNome] || "este registro";
    if (!window.confirm(`Deseja excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await excluir(config.colecao, item.id);
      setAviso({ tipo: "sucesso", texto: "Registro excluído com sucesso." });
      await carregar();
    } catch (err) {
      console.error(err);
      setAviso({ tipo: "erro", texto: "Erro ao excluir. Tente novamente." });
    }
  }

const camposDasColunas = config.colunas
  .map((nome) => {
    const campo = config.campos.find((c) => c.nome === nome);

    if (!campo) {
      console.error(
        `Coluna "${nome}" não encontrada em config.campos da coleção "${config.colecao}".`
      );
    }

    return campo;
  })
  .filter(Boolean)
  // usuário comum não vê nenhuma coluna de valores (cachê, preço, aluguel, orçamento...)
  .filter((c) => !(somenteLeitura && c.moeda));

  return (
    <section>
      <div className="pagina-topo">
        <h1>{config.titulo}</h1>
        {!form && !somenteLeitura && (
          <button className="btn btn-primario" onClick={abrirNovo}>
            Novo registro
          </button>
        )}
      </div>

      {somenteLeitura && (
        <p className="dica-leitura">Você tem acesso apenas para visualizar estes dados.</p>
      )}

      {aviso && <div className={`aviso aviso-${aviso.tipo}`}>{aviso.texto}</div>}

      {form && !somenteLeitura && (
        <form className="formulario" onSubmit={salvar} noValidate>
          <h2>{editandoId ? "Editar registro" : "Novo registro"}</h2>
          <div className="formulario-grade">
            {config.campos.map((campo) => (
              <div
                key={campo.nome}
                className={`campo ${campo.tipo === "textarea" ? "campo-largo" : ""}`}
              >
                {campo.tipo === "checkbox" ? (
                  <label className="campo-check">
                    <input
                      type="checkbox"
                      checked={form[campo.nome]}
                      onChange={(e) => mudarCampo(campo, e)}
                    />
                    {campo.rotulo}
                  </label>
                ) : (
                  <>
                    <label htmlFor={campo.nome}>
                      {campo.rotulo}
                      {campo.obrigatorio ? " *" : ""}
                    </label>

                    {campo.tipo === "select" && (
                      <select
                        id={campo.nome}
                        value={form[campo.nome]}
                        onChange={(e) => mudarCampo(campo, e)}
                      >
                        <option value="">Selecione</option>
                        {campo.opcoes.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}

                    {campo.tipo === "ref" && (
                      <select
                        id={campo.nome}
                        value={form[campo.nome]}
                        onChange={(e) => mudarCampo(campo, e)}
                      >
                        <option value="">Selecione</option>
                        {(opcoes[campo.ref] || []).map((o) => (
                          <option key={o.id} value={o.id}>
                            {o[COLECOES[campo.ref].campoNome]}
                          </option>
                        ))}
                      </select>
                    )}

{campo.tipo === "refs" && (
  <div className="seletor-artistas">
    <button
      type="button"
      className="seletor-artistas-botao"
      onClick={() => setListaArtistasAberta(!listaArtistasAberta)}
    >
      <span>
        {(form[campo.nome] || []).length > 0
          ? `${form[campo.nome].length} artista(s) selecionado(s)`
          : "Selecione os artistas"}
      </span>
      <span>{listaArtistasAberta ? "" : ""}</span>
    </button>

    {listaArtistasAberta && (
      <div className="seletor-artistas-lista">
        {opcoesFiltradas(campo, form).map((artista) => (
          <label key={artista.id} className="artista-opcao">
            <input
              type="checkbox"
              checked={(form[campo.nome] || []).includes(artista.id)}
              onChange={(e) =>
                mudarReferenciaMultipla(
                  campo,
                  artista.id,
                  e.target.checked
                )
              }
            />
            {artista[COLECOES[campo.ref].campoNome]}
          </label>
        ))}

        {opcoesFiltradas(campo, form).length === 0 && (
          <p>
            {campo.filtrarPor && form[campo.filtrarPor.campoForm]
              ? `Nenhum artista cadastrado no gênero ${form[campo.filtrarPor.campoForm]}.`
              : "Nenhum artista cadastrado."}
          </p>
        )}

        <button
          type="button"
          className="btn btn-primario"
          onClick={() => setListaArtistasAberta(false)}
        >
          Confirmar seleção
        </button>
      </div>
    )}
  </div>
)}


                    {campo.tipo === "textarea" && (
                      <textarea
                        id={campo.nome}
                        rows="3"
                        value={form[campo.nome]}
                        onChange={(e) => mudarCampo(campo, e)}
                      />
                    )}

                  
{["text", "number", "date", "time"].includes(campo.tipo) && (
  <input
    id={campo.nome}
    type={campo.moeda ? "text" : campo.tipo}
    inputMode={campo.moeda ? "decimal" : undefined}
    min={!campo.moeda && campo.tipo === "number" ? "0" : undefined}
    step={!campo.moeda && campo.tipo === "number" ? "any" : undefined}
    placeholder={campo.placeholder || ""}
    value={form[campo.nome] ?? ""}
    onChange={(e) => mudarCampo(campo, e)}
  />
)}


                    {campo.tipo === "refs" &&
                      campo.filtrarPor &&
                      form[campo.filtrarPor.campoForm] && (
                        <span className="dica">
                          Mostrando apenas artistas de {form[campo.filtrarPor.campoForm]}.
                        </span>
                      )}

                    {campo.tipo === "ref" && (opcoes[campo.ref] || []).length === 0 && (
                      <span className="dica">
                        Nenhum registro em "{COLECOES[campo.ref].titulo}". Cadastre um primeiro.
                      </span>
                    )}
                    {errosCampos[campo.nome] && (
                      <span className="erro-campo">{errosCampos[campo.nome]}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="formulario-botoes">
            <button type="submit" className="btn btn-primario" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="btn" onClick={fecharFormulario} disabled={salvando}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {carregando && <Loading />}

      {!carregando && erro && (
        <div className="aviso aviso-erro">
          {erro}{" "}
          <button className="btn" onClick={carregar}>
            Tentar de novo
          </button>
        </div>
      )}

      {!carregando && !erro && itens.length === 0 && (
        <p className="vazio">
          {somenteLeitura
            ? "Nenhum registro cadastrado ainda."
            : 'Nenhum registro cadastrado ainda. Clique em "Novo registro" para começar.'}
        </p>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                {camposDasColunas.map((c) => (
                  <th key={c.nome}>{c.rotulo}</th>
                ))}
                {!somenteLeitura && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  {camposDasColunas.map((c) => (
                    <td key={c.nome}>{textoDaCelula(c, item[c.nome])}</td>
                  ))}
                  {!somenteLeitura && (
                    <td className="acoes">
                      <button className="btn" onClick={() => abrirEdicao(item)}>
                        Editar
                      </button>
                      <button className="btn btn-perigo" onClick={() => remover(item)}>
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
