// Geometria única do formato de ponta de dedo.
// Usada pelo contorno de progresso e pelas cristas da impressão digital,
// para que as duas coisas encaixem sempre exatamente.

export const WIDTH = 96;
export const HEIGHT = 132;
export const BOTTOM_RADIUS = 24;
export const STROKE = 3;

/**
 * Contorno do dedo "encolhido" `inset` px para dentro.
 * Começa no topo e segue no sentido horário.
 */
export function fingerShape(inset: number) {
  const cx = WIDTH / 2;
  const r = (WIDTH - 2 * inset) / 2; // raio da cúpula
  const x0 = inset;
  const x1 = WIDTH - inset;
  const yTop = inset;
  const yArcEnd = inset + r; // onde a cúpula termina e começam as laterais
  const yBottom = HEIGHT - inset;

  // Mantém os cantos da base arredondados (nunca maiores que a cúpula),
  // para as cristas do miolo ficarem ovais em vez de quadradas
  const rb = Math.min(BOTTOM_RADIUS, r);
  const corner = (x: number, y: number) =>
    rb > 0.5 ? `A ${rb} ${rb} 0 0 1 ${x} ${y}` : `L ${x} ${y}`;

  const d = [
    `M ${cx} ${yTop}`,
    `A ${r} ${r} 0 0 1 ${x1} ${yArcEnd}`,
    `L ${x1} ${yBottom - rb}`,
    corner(x1 - rb, yBottom),
    `L ${x0 + rb} ${yBottom}`,
    corner(x0, yBottom - rb),
    `L ${x0} ${yArcEnd}`,
    `A ${r} ${r} 0 0 1 ${cx} ${yTop}`,
    "Z",
  ].join(" ");

  const length =
    Math.PI * r + // cúpula
    2 * (yBottom - rb - yArcEnd) + // laterais
    Math.PI * rb + // cantos inferiores
    (x1 - x0 - 2 * rb); // base reta

  return { d, length };
}

/** Contorno externo (o do anel de progresso) */
export const OUTLINE = fingerShape(STROKE / 2);
