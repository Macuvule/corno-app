
export type Verdict = {
  risk: number;
  title: string;
  message: string;
};

type Tier = {
  min: number;
  max: number;
  title: string;
  messages: string[];
};

/**
 * Categorias fictícias do CornoCheck.
 *
 * As percentagens são utilizadas apenas para entretenimento.
 * Não representam uma avaliação real da fidelidade de ninguém.
 */
const TIERS: Tier[] = [
  {
    min: 0,
    max: 20,
    title: "Santinho 😇",
    messages: [
      "Esse parece tão fiel que, se receber uma mensagem suspeita, ainda te vai mostrar para pedir opinião.",
      "O maior perigo desse relacionamento é ele esquecer o vosso aniversário e dizer que estava a pensar em ti.",
      "Se fidelidade desse certificado, esse já estaria a dar aulas.",
      "Esse tem cara de quem responde 'estou a namorar' antes mesmo de lhe perguntarem se está solteiro."
    ],
  },

  {
    min: 21,
    max: 40,
    title: "Matreco 👀",
    messages: [
      "Não procura problemas, mas também não fecha a porta quando aparece uma oportunidade.",
      "Esse diz que tem muitas amigas. A questão é saber quantas delas sabem que ele está numa relação.",
      "Se o namoro fosse um jogo, esse ainda estaria no tutorial, mas já anda a explorar outros mapas.",
      "Esse pode não trair, mas também não perde uma oportunidade de dizer que é muito solicitado."
    ],
  },

  {
    min: 41,
    max: 60,
    title: "Perigoso ⚠️",
    messages: [
      "Dois meses de namoro e já existe uma amiga que te chamam de ciumenta por causa dela.",
      "Quando perguntares quem mandou a mensagem, vais ouvir uma história com 14 capítulos e três temporadas.",
      "O namoro ainda é recente, mas as desculpas já parecem ter cinco anos de experiência.",
      "Se a desculpa 'não é nada disso que estás a pensar' fosse uma profissão, esse já seria gerente."
    ],
  },

  {
    min: 61,
    max: 80,
    title: "Muito perigoso 🔥",
    messages: [
      "Vai jurar amor eterno durante um ano e aparecer numa foto abraçado à tua amiga perto do teu aniversário.",
      "Esse vai dizer que saiu com os amigos. O problema é que os amigos nunca aparecem nas fotografias.",
      "Se houvesse um prémio para explicações criativas, esse já teria uma estante cheia de troféus."
    ],
  },

  {
    min: 81,
    max: 100,
    title: "Caso perdido ☠️",
    messages: [
      "Esse não diz 'amo-te' a uma pessoa. Parece que está a fazer uma campanha de marketing.",
      "Esse parece ter confundido relacionamento sério com inscrição num programa de fidelização."
    ],
  },
];

/**
 * Guarda a última mensagem apresentada por categoria,
 * para reduzir a possibilidade de repetição consecutiva.
 */
const lastMessageByTier = new Map<string, string>();

/**
 * Escolhe uma mensagem aleatória da categoria.
 * Evita repetir imediatamente a mensagem anterior da mesma categoria.
 */
function pickMessage(tier: Tier): string {
  const previousMessage = lastMessageByTier.get(tier.title);

  const availableMessages =
    tier.messages.length > 1
      ? tier.messages.filter((message) => message !== previousMessage)
      : tier.messages;

  const message =
    availableMessages[
      Math.floor(Math.random() * availableMessages.length)
    ];

  lastMessageByTier.set(tier.title, message);

  return message;
}

/**
 * Escolhe uma categoria aleatória e gera um veredicto fictício.
 */
export function pickVerdict(): Verdict {
  const tier = TIERS[0];

  const risk =
    tier.min +
    Math.floor(Math.random() * (tier.max - tier.min + 1));

  return {
    risk: 13,
    title: tier.title,
    message: pickMessage(tier),
  };
}

/**
 * Mensagens apresentadas durante a animação do scanner.
 */
export const SCAN_STEPS = [
  {
    until: 30,
    text: "A ler impressão digital…",
  },
  {
    until: 60,
    text: "A consultar os arquivos secretos…",
  },
  {
    until: 90,
    text: "A analisar o histórico...",
  },
  {
    until: 101,
    text: "A preparar o veredicto…",
  },
];