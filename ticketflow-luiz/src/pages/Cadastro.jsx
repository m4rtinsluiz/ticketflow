import { useState } from "react";
import { cadastrar, mensagemDeErro } from "../services/authService";

export default function Cadastro({ aoVoltar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoCadastrar(e) {
    e.preventDefault();
    setAviso(null);

    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "Digite o seu nome";
    if (!email.trim()) novosErros.email = "Digite o e-mail";
    if (senha.length < 6) novosErros.senha = "A senha precisa ter pelo menos 6 caracteres";
    if (confirmacao !== senha) novosErros.confirmacao = "As senhas não são iguais";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
      // não precisa fazer mais nada: a conta nova já fica logada e o App libera o site
    } catch (err) {
      console.error(err);
      setAviso({
        tipo: "erro",
        texto: mensagemDeErro(err, "Não foi possível criar a conta. Tente novamente."),
      });
      setEnviando(false);
    }
  }

  return (
    <main className="login-pagina">
      <form className="login-caixa" onSubmit={aoCadastrar} noValidate>
        <h1 className="login-logo">TicketFlow</h1>
        <p className="login-subtitulo">Crie a sua conta</p>

        {aviso && <div className={`aviso aviso-${aviso.tipo}`}>{aviso.texto}</div>}

        <div className="campo">
          <label htmlFor="cad-nome">Nome</label>
          <input
            id="cad-nome"
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {erros.nome && <span className="erro-campo">{erros.nome}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cad-email">E-mail</label>
          <input
            id="cad-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {erros.email && <span className="erro-campo">{erros.email}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cad-senha">Senha</label>
          <input
            id="cad-senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erros.senha && <span className="erro-campo">{erros.senha}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cad-confirmacao">Confirmar senha</label>
          <input
            id="cad-confirmacao"
            type="password"
            autoComplete="new-password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
          />
          {erros.confirmacao && <span className="erro-campo">{erros.confirmacao}</span>}
        </div>

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>

        <button type="button" className="login-link" onClick={aoVoltar} disabled={enviando}>
          Já tenho conta
        </button>
      </form>
    </main>
  );
}
