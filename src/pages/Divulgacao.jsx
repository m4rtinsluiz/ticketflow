import CrudPage from "../components/CrudPage";
import { divulgacaoConfig } from "../config/divulgacao";

export default function Divulgacao(props) {
  return <CrudPage config={divulgacaoConfig} {...props} />;
}
