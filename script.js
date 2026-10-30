/* =========================================================
   🎃 LABORATÓRIO DE PIXÉIS ASSOMBRADOS
   Aqui está toda a "magia": mexer nos números de cada pixel.

   Lembra-te: o array "data" de uma imagem é uma lista enorme assim:
     [R, G, B, A,  R, G, B, A,  R, G, B, A, ...]
      pixel 0      pixel 1      pixel 2
   Cada pixel ocupa 4 posições, por isso andamos de 4 em 4 (i += 4).
   Cada valor vai de 0 (nada) a 255 (máximo).
   ========================================================= */

// ---------- Referências aos elementos da página ----------
const escolherFoto = document.getElementById("escolher-foto");
const tela = document.getElementById("tela");
const ctx = tela.getContext("2d", { willReadFrequently: true }); // "pincel" para desenhar no canvas
const caixaAcumular = document.getElementById("acumular");
const mensagem = document.getElementById("mensagem");

// Aqui guardamos a imagem ORIGINAL, para podermos voltar atrás
let imagemOriginal = null;

/* =========================================================
   1. CARREGAR A IMAGEM
   ========================================================= */
escolherFoto.addEventListener("change", function () {
  const ficheiro = escolherFoto.files[0];
  if (!ficheiro) return; // o utilizador cancelou

  const imagem = new Image();

  // Quando a imagem acabar de carregar...
  imagem.onload = function () {
    // O canvas fica com o tamanho REAL da imagem
    tela.width = imagem.width;
    tela.height = imagem.height;
    ctx.drawImage(imagem, 0, 0);

    imagemOriginal = imagem; // guardamos para mais tarde
    tela.classList.add("visivel");
    mensagem.textContent = "Passa o rato por cima da imagem para inspecionar os pixéis!";

    // Vamos espreitar os números!
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    console.log("Largura:", tela.width);
    console.log("Altura:", tela.height);
    console.log("Pixel (0, 0) [R, G, B]:", [pixel[0], pixel[1], pixel[2]]);

    URL.revokeObjectURL(imagem.src); // já não precisamos do endereço temporário
  };

  imagem.onerror = function () {
    alert("Ups! Não foi possível abrir esse ficheiro como imagem.");
  };

  // Cria um endereço temporário para o ficheiro (funciona em file:// sem erros de CORS)
  imagem.src = URL.createObjectURL(ficheiro);
});

/* =========================================================
   FUNÇÃO AUXILIAR: obter os pixéis para trabalhar
   - Se "Acumular" estiver DESLIGADO: começamos sempre da imagem original.
   - Se estiver LIGADO: trabalhamos por cima do que já está no canvas.
   Devolve null se ainda não houver imagem.
   ========================================================= */
function obterPixeis() {
  if (!imagemOriginal) {
    alert("Primeiro escolhe uma foto! 🎃");
    return null;
  }
  if (!caixaAcumular.checked) {
    ctx.drawImage(imagemOriginal, 0, 0);
  }
  return ctx.getImageData(0, 0, tela.width, tela.height);
}

/* =========================================================
   2. OS FILTROS
   Todos seguem a mesma receita:
     1) obter os pixéis   (getImageData)
     2) mudar os números  (ciclo for)
     3) voltar a desenhar (putImageData)
   ========================================================= */

// 0 — Repor a imagem original
function removerFiltros() {
  if (!imagemOriginal) return;
  ctx.drawImage(imagemOriginal, 0, 0);
}

// 1 — Só fica o vermelho: G e B passam a 0
function filtroVermelho() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // data[i] é o vermelho (R) — não mexemos
    data[i + 1] = 0; // verde (G)
    data[i + 2] = 0; // azul  (B)
    // data[i + 3] é a transparência (A) — não mexemos
  }

  ctx.putImageData(imageData, 0, 0);
}

// 2 — Negativo: cada cor passa a ser o seu "oposto"
function filtroNegativo() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];         // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
  }

  ctx.putImageData(imageData, 0, 0);
}

// 3 — Cinzento: quando R, G e B são iguais, a cor é cinzenta
function filtroCinzento() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const media = Math.floor((r + g + b) / 3);

    data[i] = media;
    data[i + 1] = media;
    data[i + 2] = media;
  }

  ctx.putImageData(imageData, 0, 0);
}

// 4 — Troca de canais: R recebe o verde, G recebe o azul, B recebe o vermelho
function filtroTrocaCanais() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Guardamos primeiro os valores antigos, senão perdíamo-los!
    const vermelho = data[i];
    const verde = data[i + 1];
    const azul = data[i + 2];

    data[i] = verde;
    data[i + 1] = azul;
    data[i + 2] = vermelho;
  }

  ctx.putImageData(imageData, 0, 0);
}

// 5 — Ruído: somamos um número aleatório entre -150 e 150 a cada canal
function filtroRuido() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    for (let canal = 0; canal < 3; canal++) { // 0 = R, 1 = G, 2 = B
      const aleatorio = Math.floor(Math.random() * 301) - 150; // de -150 a 150
      const valor = data[i + canal] + aleatorio;
      // Garantimos que o valor fica entre 0 e 255
      data[i + canal] = Math.max(0, Math.min(255, valor));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// 6 — Glitch: algumas linhas são "empurradas" para o lado
function filtroGlitch() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;
  const largura = tela.width;
  const altura = tela.height;

  // Cópia dos pixéis antes de mexer, para lermos sempre os valores originais
  const copia = data.slice();

  for (let y = 0; y < altura; y++) {
    // Só 30% das linhas sofrem glitch
    if (Math.random() < 0.3) {
      const deslocamento = Math.floor(Math.random() * 101) - 50; // de -50 a 50

      for (let x = 0; x < largura; x++) {
        // De que coluna vem o pixel? O "%" faz dar a volta à linha
        // (o "+ largura" evita números negativos).
        const xOrigem = ((x - deslocamento) % largura + largura) % largura;

        // Fórmula para passar de (x, y) para a posição no array 1D
        const destino = (y * largura + x) * 4;
        const origem = (y * largura + xOrigem) * 4;

        data[destino] = copia[origem];         // R
        data[destino + 1] = copia[origem + 1]; // G
        data[destino + 2] = copia[origem + 2]; // B
        data[destino + 3] = copia[origem + 3]; // A
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/* =========================================================
   3. BOTÕES E TECLADO
   A posição na lista corresponde ao número do filtro (0 a 6).
   ========================================================= */
const filtros = [
  removerFiltros,    // 0
  filtroVermelho,    // 1
  filtroNegativo,    // 2
  filtroCinzento,    // 3
  filtroTrocaCanais, // 4
  filtroRuido,       // 5
  filtroGlitch,      // 6
];

// Cada botão com "data-filtro" chama o filtro com esse número
document.querySelectorAll("[data-filtro]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    filtros[botao.dataset.filtro]();
  });
});

// Teclas 0 a 6 aplicam o filtro correspondente
document.addEventListener("keydown", function (evento) {
  if (evento.key >= "0" && evento.key <= "6" && evento.key.length === 1) {
    filtros[Number(evento.key)]();
  }
});

// Descarregar a imagem como PNG
document.getElementById("descarregar").addEventListener("click", function () {
  if (!imagemOriginal) {
    alert("Primeiro escolhe uma foto! 🎃");
    return;
  }
  const link = document.createElement("a");
  link.href = tela.toDataURL("image/png");
  link.download = "imagem-assombrada.png";
  link.click();
});

/* =========================================================
   4. INSPEÇÃO DE PIXEL (ao passar o rato)
   ========================================================= */
const infoPosicao = document.getElementById("info-posicao");
const infoRgb = document.getElementById("info-rgb");
const amostraCor = document.getElementById("amostra-cor");

tela.addEventListener("mousemove", function (evento) {
  // O canvas pode estar encolhido no ecrã, por isso convertemos
  // a posição do rato para a posição do pixel real.
  const caixa = tela.getBoundingClientRect();
  const x = Math.floor((evento.clientX - caixa.left) * tela.width / caixa.width);
  const y = Math.floor((evento.clientY - caixa.top) * tela.height / caixa.height);

  // Pedimos só 1 pixel (1 x 1)
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];

  infoPosicao.textContent = "(" + x + ", " + y + ")";
  infoRgb.textContent = "RGB(" + r + ", " + g + ", " + b + ")";
  amostraCor.style.background = "rgb(" + r + ", " + g + ", " + b + ")";
});
