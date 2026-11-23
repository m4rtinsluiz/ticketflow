import { useMemo } from "react";

// QR Code FALSO, só visual: não guarda informação nenhuma e nenhum leitor consegue ler.
// O desenho é sempre o mesmo para o mesmo "valor" (o código do pedido), por isso cada
// ingresso tem o seu padrão próprio. Não precisa de nenhuma biblioteca.

const N = 25; // o código é uma grade de 25 x 25 quadradinhos
const MARGEM = 2;

// transforma o texto num número (hash FNV-1a), usado como semente
function semente(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// gerador de números aleatórios que sempre repete a mesma sequência para a mesma semente
function aleatorio(inicio) {
  let a = inicio;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// desenha os quadrados de canto (7x7) e o quadrado pequeno de alinhamento (5x5)
function marcar(grade, reservado, x0, y0, tamanho) {
  for (let y = 0; y < tamanho; y++) {
    for (let x = 0; x < tamanho; x++) {
      const borda = x === 0 || y === 0 || x === tamanho - 1 || y === tamanho - 1;
      const miolo = Math.abs(x - (tamanho - 1) / 2) <= (tamanho === 7 ? 1 : 0) &&
        Math.abs(y - (tamanho - 1) / 2) <= (tamanho === 7 ? 1 : 0);
      grade[y0 + y][x0 + x] = borda || miolo;
      reservado[y0 + y][x0 + x] = true;
    }
  }
}

function montarGrade(valor) {
  const sorteio = aleatorio(semente(valor));
  const grade = Array.from({ length: N }, () => Array(N).fill(false));
  const reservado = Array.from({ length: N }, () => Array(N).fill(false));

  // cantos: quadrado + faixa clara de 1 quadradinho em volta
  [[0, 0], [N - 7, 0], [0, N - 7]].forEach(([x, y]) => {
    for (let j = -1; j <= 7; j++) {
      for (let i = -1; i <= 7; i++) {
        const gx = x + i;
        const gy = y + j;
        if (gx >= 0 && gy >= 0 && gx < N && gy < N) reservado[gy][gx] = true;
      }
    }
    marcar(grade, reservado, x, y, 7);
  });
  marcar(grade, reservado, N - 9, N - 9, 5);

  // linhas de tempo (pontilhado entre os cantos)
  for (let i = 8; i < N - 8; i++) {
    grade[6][i] = i % 2 === 0;
    grade[i][6] = i % 2 === 0;
    reservado[6][i] = true;
    reservado[i][6] = true;
  }

  // o resto é preenchido "ao acaso"
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!reservado[y][x]) grade[y][x] = sorteio() < 0.5;
    }
  }
  return grade;
}

export default function QRCodeFake({ valor, tamanho = 180 }) {
  const caminho = useMemo(() => {
    const grade = montarGrade(valor);
    let d = "";
    grade.forEach((linha, y) =>
      linha.forEach((preenchido, x) => {
        if (preenchido) d += `M${x + MARGEM} ${y + MARGEM}h1v1h-1z`;
      })
    );
    return d;
  }, [valor]);

  const lado = N + MARGEM * 2;

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${lado} ${lado}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR Code ilustrativo do ingresso"
    >
      <rect width={lado} height={lado} fill="#ffffff" />
      <path d={caminho} fill="#111111" />
    </svg>
  );
}
