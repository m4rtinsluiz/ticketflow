import CrudPage from "../components/CrudPage";
import { localConfig } from "../config/local";

export default function Locais(props) {
  return <CrudPage config={localConfig} {...props} />;
}
