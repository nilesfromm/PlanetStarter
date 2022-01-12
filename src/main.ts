import "./style.css";
import { PlanetGradient } from "./planet";

window.onload = () => {
  new PlanetGradient(document.getElementsByClassName("viewport")[0] as HTMLElement);
};
