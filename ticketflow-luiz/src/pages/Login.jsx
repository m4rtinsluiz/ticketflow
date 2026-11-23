import { useState } from "react";
import { entrar, recuperarSenha, mensagemDeErro } from "../services/authService";
import Cadastro from "./Cadastro";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", texto }
  const [enviando, setEnviando] = useState(false);
  const [criandoConta, setCriandoConta] = useState(false);

  async function aoEntrar(e) {
    e.preventDefault();
    setAviso(null);

    const novosErros = {};
    if (!email.trim()) novosErros.email = "Digite o e-mail";
    if (!senha) novosErros.senha = "Digite a senha";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
      // não precisa fazer mais nada: o App percebe o login sozinho e libera o site
    } catch (err) {
      console.error(err);
      setAviso({ tipo: "erro", texto: mensagemDeErro(err) });
      setEnviando(false);
    }
  }

  async function aoEsquecerSenha() {
    setAviso(null);
    if (!email.trim()) {
      setErros({ email: "Digite o e-mail para receber o link" });
      return;
    }
    setErros({});
    try {
      await recuperarSenha(email.trim());
      setAviso({
        tipo: "sucesso",
        texto: "Se este e-mail tiver cadastro, enviamos um link para criar uma nova senha.",
      });
    } catch (err) {
      console.error(err);
      setAviso({ tipo: "erro", texto: mensagemDeErro(err) });
    }
  }

  if (criandoConta) {
    return <Cadastro aoVoltar={() => setCriandoConta(false)} />;
  }

  return (
    <main className="login-pagina">
      <form className="login-caixa" onSubmit={aoEntrar} noValidate>
        <h1 className="login-logo">TicketFlow</h1>
        <p className="login-subtitulo">Entre para acessar o sistema</p>

        {aviso && <div className={`aviso aviso-${aviso.tipo}`}>{aviso.texto}</div>}

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {erros.email && <span className="erro-campo">{erros.email}</span>}
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erros.senha && <span className="erro-campo">{erros.senha}</span>}
        </div>

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>

        <button type="button" className="login-link" onClick={aoEsquecerSenha}>
          Esqueci minha senha
        </button>

        <button type="button" className="login-link" onClick={() => setCriandoConta(true)}>
          Não tenho conta. Criar agora
        </button>
      </form>
    </main>
  );
}
