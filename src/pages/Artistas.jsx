import CrudPage from "../components/CrudPage";
import { artistasConfig } from "../config/artistas";

export default function Artistas(props) {
  return <CrudPage config={artistasConfig} {...props} />;
}
