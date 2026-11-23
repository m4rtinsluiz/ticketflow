import CrudPage from "../components/CrudPage";
import { ingressosConfig } from "../config/ingressos";

export default function Ingressos(props) {
  return <CrudPage config={ingressosConfig} {...props} />;
}
