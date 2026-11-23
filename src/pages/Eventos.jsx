import CrudPage from "../components/CrudPage";
import { eventosConfig } from "../config/eventos";

export default function Eventos(props) {
  return <CrudPage config={eventosConfig} {...props} />;
}
