import type { ImageRequireSource } from "react-native";

export type HistoryEntry = {
  id: string;
  name: string;
  /** Troca por require("@/assets/images/...") para usar fotos locais */
  photo: ImageRequireSource;
  risk: number; // 0-100
  title: string;
  message: string;
  date: string;
};

// Histórico estático (3 mulheres e 1 homem).
// Títulos e mensagens vêm das categorias do content.ts.
export const HISTORY: HistoryEntry[] = [
  {
    id: "1",
    name: "Beatriz Cossa",
    photo: require("../../../assets/images/1.jpg"),
    risk: 12,
    title: "Santinho 😇",
    message:
      "Esse tem cara de quem responde 'estou a namorar' antes mesmo de lhe perguntarem se está solteiro.",
    date: "Hoje, 10:13",
  },
  {
    id: "2",
    name: "Rui",
    photo: require("../../../assets/images/2.jpg"),
    risk: 35,
    title: "Matreco 👀",
    message:
      "Esse diz que tem muitas amigas. A questão é saber quantas delas sabem que ele está numa relação.",
    date: "Ontem, 18:32",
  },
  {
    id: "3",
    name: "Anabela",
    photo: require("../../../assets/images/3.jpg"),
    risk: 54,
    title: "Perigoso ⚠️",
    message:
      "Se a desculpa 'não é nada disso que estás a pensar' fosse uma profissão, esse já seria gerente.",
    date: "24 Out, 22:05",
  },
  {
    id: "4",
    name: "Jessica Nhantumbo",
    photo: require("../../../assets/images/4.png"),
    risk: 91,
    title: "Caso perdido ☠️",
    message:
      "Esse parece ter confundido relacionamento sério com inscrição num programa de fidelização.",
    date: "19 Out, 16:40",
  },
];
