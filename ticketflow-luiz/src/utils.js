import { Timestamp } from "firebase/firestore";

// "2026-11-20" (input de data) -> Timestamp do Firestore
export function paraTimestamp(texto) {
  if (!texto) return null;
  return Timestamp.fromDate(new Date(texto + "T12:00:00"));
}

// Timestamp (ou texto antigo) -> objeto Date
export function paraDate(valor) {
  if (!valor) return null;
  const d = valor.toDate ? valor.toDate() : new Date(valor);
  return isNaN(d) ? null : d;
}

// Timestamp -> "2026-11-20" (formato exigido pelo input type="date")
export function paraInput(valor) {
  const d = paraDate(valor);
  if (!d) return "";
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function formatarData(valor) {
  const d = paraDate(valor);
  return d ? d.toLocaleDateString("pt-BR") : "-";
}


export function formatarMoeda(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "";
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "";
  }

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


// Remove acentos e deixa minúsculo (para a busca)
export function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
