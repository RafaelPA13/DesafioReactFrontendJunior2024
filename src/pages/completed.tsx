// Importe componente
import Conteudo from "../components/conteudo";
//Importe react-router-dom
import { useLocation } from "react-router-dom";

export function Completed() {
  return <Conteudo filtro="completed" />;
}
