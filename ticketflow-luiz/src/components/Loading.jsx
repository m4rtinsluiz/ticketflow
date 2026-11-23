export default function Loading({ texto = "Carregando..." }) {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>{texto}</p>
    </div>
  );
}
