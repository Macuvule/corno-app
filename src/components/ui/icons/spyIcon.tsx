import React from "react";
import Svg, { Defs, Mask, Path, Rect } from "react-native-svg";

type IconProps = { color?: string; size?: number };

/**
 * Ícone "modo espião" (index).
 * O fundo preto do SVG original foi removido e a faixa preta do chapéu
 * virou um recorte (mask), então o ícone assume qualquer cor via `color`
 * e funciona sobre qualquer fundo.
 */
export default function SpyIcon({ color = "#FFFFFF", size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="130 130 764 820">
      <Defs>
        <Mask
          id="spy-mask"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={1024}
          height={1024}
        >
          {/* Copa do chapéu */}
          <Path
            d="M302 354 L354 208 C374 153 411 145 454 164 L512 190 L570 164 C613 145 650 153 670 208 L722 354 C662 383 590 397 512 397 C434 397 362 383 302 354 Z"
            fill="#FFF"
          />
          {/* Faixa (recorte) */}
          <Path
            d="M287 354 C354 382 431 393 512 393 C593 393 670 382 737 354 L753 414 C679 446 598 460 512 460 C426 460 345 446 271 414 Z"
            fill="#000"
          />
          {/* Aba */}
          <Path
            d="M285 386 C225 400 166 429 151 459 C130 502 213 539 315 555 C378 565 445 570 512 570 C579 570 646 565 709 555 C811 539 894 502 873 459 C858 429 799 400 739 386 C673 420 595 438 512 438 C429 438 351 420 285 386 Z"
            fill="#FFF"
          />
          {/* Lente esquerda */}
          <Path
            d="M263 510 C322 524 397 529 475 526 C469 592 448 644 408 671 C367 698 319 681 294 640 C276 611 267 559 263 510 Z"
            fill="#FFF"
          />
          {/* Lente direita */}
          <Path
            d="M549 526 C627 529 702 524 761 510 C757 559 748 611 730 640 C705 681 657 698 616 671 C576 644 555 592 549 526 Z"
            fill="#FFF"
          />
          {/* Coração */}
          <Path
            d="M512 713 C476 667 420 651 379 679 C334 710 342 765 374 805 C407 846 464 891 512 930 C560 891 617 846 650 805 C682 765 690 710 645 679 C604 651 548 667 512 713 Z"
            fill="#FFF"
          />
        </Mask>
      </Defs>

      <Rect
        x={0}
        y={0}
        width={1024}
        height={1024}
        fill={color}
        mask="url(#spy-mask)"
      />
    </Svg>
  );
}
