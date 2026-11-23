// Índice das coleções do Firestore. Cada coleção tem o seu próprio arquivo nesta pasta
// (campos do formulário e colunas da tabela). Aqui eles só são reunidos num objeto único,
// que o menu, o CrudPage e o seedService usam para localizar qualquer coleção pela chave.
//
// Tipos de campo: text, textarea, number, date, time, select, checkbox, ref, refs
//  - ref  = guarda o ID de um documento de outra coleção (ex.: localId)
//  - refs = guarda uma lista de IDs (ex.: artistaIds)

import { eventosConfig } from "./eventos";
import { artistasConfig } from "./artistas";
import { localConfig } from "./local";
import { ingressosConfig } from "./ingressos";
import { divulgacaoConfig } from "./divulgacao";

export { GENEROS } from "./generos";

export const ORDEM_MENU = ["eventos", "artistas", "local", "ingressos", "divulgacao"];

export const COLECOES = {
  eventos: eventosConfig,
  artistas: artistasConfig,
  local: localConfig,
  ingressos: ingressosConfig,
  divulgacao: divulgacaoConfig,
};
