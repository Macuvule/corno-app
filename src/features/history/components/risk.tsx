import { MINT } from "@/constants/theme";

/**
 * Cor do nível de risco, alinhada com as categorias do content.ts:
 * 0-20 Santinho · 21-40 Matreco · 41-60 Perigoso · 61-80 Muito perigoso · 81-100 Caso perdido
 */
export function riskColor(risk: number): string {
  if (risk <= 20) return MINT;
  if (risk <= 40) return "#C6E86A";
  if (risk <= 60) return "#F5B544";
  if (risk <= 80) return "#FF8A4C";
  return "#FF5A5F";
}
