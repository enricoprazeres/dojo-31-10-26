const escolherFoto = document.getElementById("escolher-foto");
const tela = document.getElementById("tela");
const ctx = tela.getContext("2d", { willReadFrequently: true });
const caixaAcumular = document.getElementById("acumular");
const mensagem = document.getElementById("mensagem");

let imagemOriginal = null;

escolherFoto.addEventListener("change", function () {
  const ficheiro = escolherFoto.files[0];
  if (!ficheiro) return;

  const imagem = new Image();

  imagem.onload = function () {
    tela.width = imagem.width;
    tela.height = imagem.height;
    ctx.drawImage(imagem, 0, 0);

    imagemOriginal = imagem;
    tela.classList.add("visivel");
    mensagem.textContent = "Passa o rato por cima da imagem para inspecionar os pixéis!";

    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    console.log("Largura:", tela.width);
    console.log("Altura:", tela.height);
    console.log("Pixel (0, 0) [R, G, B]:", [pixel[0], pixel[1], pixel[2]]);

    URL.revokeObjectURL(imagem.src);
  };

  imagem.onerror = function () {
    alert("Ups! Não foi possível abrir esse ficheiro como imagem.");
  };

  imagem.src = URL.createObjectURL(ficheiro);
});

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

function removerFiltros() {
  if (!imagemOriginal) return;
  ctx.drawImage(imagemOriginal, 0, 0);
}

function filtroVermelho() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

function filtroNegativo() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

function filtroCinzento() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

function filtroTrocaCanais() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

function filtroRuido() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

function filtroGlitch() {
  const imageData = obterPixeis();
  if (!imageData) return;
  const data = imageData.data;
  const largura = tela.width;
  const altura = tela.height;
  const copia = data.slice();

  // ✏️ A TUA VEZ

  ctx.putImageData(imageData, 0, 0);
}

const filtros = [
  removerFiltros,
  filtroVermelho,
  filtroNegativo,
  filtroCinzento,
  filtroTrocaCanais,
  filtroRuido,
  filtroGlitch,
];

document.querySelectorAll("[data-filtro]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    filtros[botao.dataset.filtro]();
  });
});

document.addEventListener("keydown", function (evento) {
  if (evento.key >= "0" && evento.key <= "6" && evento.key.length === 1) {
    filtros[Number(evento.key)]();
  }
});

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

const infoPosicao = document.getElementById("info-posicao");
const infoRgb = document.getElementById("info-rgb");
const amostraCor = document.getElementById("amostra-cor");

tela.addEventListener("mousemove", function (evento) {
  const caixa = tela.getBoundingClientRect();
  const x = Math.floor((evento.clientX - caixa.left) * tela.width / caixa.width);
  const y = Math.floor((evento.clientY - caixa.top) * tela.height / caixa.height);

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];

  infoPosicao.textContent = "(" + x + ", " + y + ")";
  infoRgb.textContent = "RGB(" + r + ", " + g + ", " + b + ")";
  amostraCor.style.background = "rgb(" + r + ", " + g + ", " + b + ")";
});
