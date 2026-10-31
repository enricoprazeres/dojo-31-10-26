# 🎃 Guia do Mentor — Pixéis Assombrados

Oct 30, 2026 · @Jonas

## Resumo da sessão

Os ninjas escrevem 6 filtros de imagem mexendo diretamente nos números de cada pixel. Tudo o resto (upload, botões, teclado, download, inspetor) já está feito no código base.

- **Pasta dos ninjas:** `codigo-base/`. Só mexem no `script.js`, onde está `// ✏️ A TUA VEZ`.
- **Soluções:** a pasta de cima (`index.html`, `style.css`, `script.js` completos).
- **Abrir:** duplo clique no `index.html`. Não é preciso servidor. Depois de gravar o código, basta recarregar a página (F5).
- **Consola:** F12 → separador Consola. Ao carregar uma foto aparecem a largura, a altura e o pixel (0, 0).
- **Testar:** passar o rato por cima da imagem mostra o RGB de cada pixel. É a melhor forma de confirmar se o filtro está certo.

### Plano de tempos (assumi 90 minutos)

| Tempo | O quê |
| --- | --- |
| 0–15 min | Introdução: o que é um pixel, RGB, explorar com o inspetor |
| 15–30 min | Filtro 1 (Vermelho) todos juntos, no projetor |
| 30–55 min | Filtros 2, 3 e 4 sozinhos, mentores a circular |
| 55–75 min | Filtro 5 (Ruído) e 6 (Glitch) para quem avança |
| 75–90 min | Acumular filtros, descarregar o PNG, mostrar resultados |

## Conceitos a ensinar

A ideia central: **uma imagem é só uma lista enorme de números**, e mudar os números muda a imagem.

1. **Pixel** — o quadradinho mais pequeno da imagem. Uma foto de 800 × 600 tem 480 000 pixels.
   - Pergunta: "Quantos pixels tem a vossa foto?" (largura × altura, está na consola).
2. **RGB** — cada pixel mistura 3 luzes: Vermelho, Verde e Azul. Cada uma vai de 0 (apagada) a 255 (no máximo).
   - RGB(255, 0, 0) = vermelho · RGB(0, 0, 0) = preto · RGB(255, 255, 255) = branco · RGB(255, 255, 0) = amarelo.
   - Pergunta: "Como fica uma cor em que os 3 valores são iguais?" (cinzento) — prepara o filtro 3.
   - Porquê 255? Cada valor cabe em 1 byte = 8 bits = 256 valores possíveis (0 a 255).
3. **Canvas** — a "tela" da página onde o JavaScript pode desenhar e ler pixels.
4. **O array `data`** — todos os pixels seguidos numa lista: `[R, G, B, A, R, G, B, A, ...]`.
   - O **A** (alfa) é a transparência. Não mexemos nele.
   - Por isso o ciclo anda **de 4 em 4**: `for (let i = 0; i < data.length; i += 4)`.
   - Dentro do ciclo: `data[i]` = R, `data[i + 1]` = G, `data[i + 2]` = B.
5. **A receita de todos os filtros** (já está no código base):
   1. `getImageData` — tirar os números do canvas.
   2. Mudar os números — **isto é o que os ninjas escrevem**.
   3. `putImageData` — pôr os números de volta no canvas.
6. **De (x, y) para a posição no array** (só para o Glitch): `(y * largura + x) * 4`.
   - Analogia: lugares num cinema. Para chegar à fila y, passas por y filas inteiras (`y * largura`) e depois andas x lugares. Multiplica por 4 porque cada pixel ocupa 4 números.

**Truque para o início:** antes de escreverem código, ponham os ninjas a passar o rato pela imagem e a descobrir onde há mais vermelho, onde está o pixel mais escuro, etc.

## Filtro a filtro

Cada solução entra no sítio do `// ✏️ A TUA VEZ`. Não mostrar a solução logo: primeiro fazer a pergunta.

### 1 — Vermelho (fazer em conjunto)

**Explicar:** se apagarmos as luzes verde e azul, só sobra o vermelho.

**Perguntar:** "Que valor põe uma luz desligada?" (0)

```js
for (let i = 0; i < data.length; i += 4) {
  data[i + 1] = 0; // G
  data[i + 2] = 0; // B
}
```

**Verificar:** no inspetor, G e B têm de dar sempre 0.

### 2 — Negativo

**Explicar:** cada valor passa para o lado oposto da escala: 0 vira 255, 255 vira 0, 100 vira 155.

**Perguntar:** "Se um valor é 200, quanto falta para 255?" (55 → `255 - valor`)

```js
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255 - data[i];
  data[i + 1] = 255 - data[i + 1];
  data[i + 2] = 255 - data[i + 2];
}
```

**Curiosidade:** aplicar o negativo 2 vezes com "Acumular" ligado volta à foto original.

### 3 — Cinzento

**Explicar:** quando R, G e B são iguais, a cor é cinzenta. Usamos a média dos 3.

**Perguntar:** "Como se calcula a média de 3 números?" e "Porquê `Math.floor`?" (os pixels só aceitam números inteiros).

```js
for (let i = 0; i < data.length; i += 4) {
  const media = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
  data[i] = media;
  data[i + 1] = media;
  data[i + 2] = media;
}
```

**Erro comum:** mudar `data[i]` primeiro e só depois calcular a média. Tem de se calcular a média antes.

### 4 — Troca de canais

**Explicar:** o vermelho recebe o verde, o verde recebe o azul, o azul recebe o vermelho.

**Perguntar:** "Se eu fizer `data[i] = data[i + 1]` primeiro, o que acontece ao vermelho antigo?" (perde-se). Analogia: trocar o conteúdo de 2 copos precisa de um 3.º copo.

```js
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  data[i] = g;
  data[i + 1] = b;
  data[i + 2] = r;
}
```

**Efeito:** céu azul fica vermelho, relva verde fica azul. Muito Halloween.

### 5 — Ruído

**Explicar:** somamos um número aleatório a cada canal, como chuvisco numa TV antiga.

**Perguntar:** "E se o valor ficar 300 ou -20?" Os valores têm de ficar entre 0 e 255.

```js
for (let i = 0; i < data.length; i += 4) {
  for (let canal = 0; canal < 3; canal++) {
    const aleatorio = Math.floor(Math.random() * 301) - 150;
    const valor = data[i + canal] + aleatorio;
    data[i + canal] = Math.max(0, Math.min(255, valor));
  }
}
```

**Explicar o aleatório:** `Math.random()` dá de 0 a 0,999. Vezes 301 dá de 0 a 300. Menos 150 dá de -150 a 150.

**Explicar o limite:** `Math.min(255, valor)` corta o que passa de 255. `Math.max(0, ...)` corta o que fica abaixo de 0.

### 6 — Glitch (desafio)

**Explicar:** em 30% das linhas, empurramos a linha toda para o lado. O que sai de um lado entra pelo outro.

**Perguntar:** "Porque precisamos da `copia`?" (se lermos do mesmo array que estamos a mudar, lemos pixels já empurrados).

```js
for (let y = 0; y < altura; y++) {
  if (Math.random() < 0.3) {
    const deslocamento = Math.floor(Math.random() * 101) - 50;
    for (let x = 0; x < largura; x++) {
      const xOrigem = ((x - deslocamento) % largura + largura) % largura;
      const destino = (y * largura + x) * 4;
      const origem = (y * largura + xOrigem) * 4;
      data[destino] = copia[origem];
      data[destino + 1] = copia[origem + 1];
      data[destino + 2] = copia[origem + 2];
      data[destino + 3] = copia[origem + 3];
    }
  }
}
```

**Explicar o `%`:** é o resto da divisão, como um relógio: depois das 12 volta à 1. Numa linha de 100 pixels, a coluna 105 volta a ser a 5. O `+ largura` serve para números negativos: em JavaScript, `-5 % 100` dá -5, não 95.

## Tirar coisas do HTML para os ninjas fazerem

Podes apagar elementos do `codigo-base/index.html`, mas o ninja tem de os voltar a criar com **exatamente o mesmo `id`**. O `script.js` encontra cada elemento pelo `id`. Se não o encontrar, dá erro e o código que vem a seguir deixa de correr.

| O que tirar | O que o ninja escreve | Se faltar ou o `id` estiver mal escrito |
| --- | --- | --- |
| Textos (`<h1>`, `<h2>`, `<p>`) | Os títulos e textos que quiser | Nada parte |
| Os 7 botões dentro de `<div class="botoes">` | `<button data-filtro="1">Vermelho</button>` (números 0 a 6) | Nada parte. As teclas 0–6 continuam a funcionar |
| Caixa de acumular | `<input type="checkbox" id="acumular">` | Os filtros 1–6 dão erro ao carregar no botão |
| Botão de download | `<button id="descarregar">Descarregar</button>` | O inspetor de pixel deixa de funcionar (vem depois no código) |
| Inspetor de pixel | `<div id="amostra-cor" class="amostra"></div>`, `<span id="info-posicao"></span>` e `<span id="info-rgb"></span>` | Erro sempre que o rato passa na imagem. O resto funciona |
| Mensagem | `<p id="mensagem"></p>` | A imagem aparece, mas a consola não mostra a largura, a altura nem o pixel (0, 0) |
| Escolher ficheiro | `<input type="file" id="escolher-foto" accept="image/*">` | **Nada funciona** |
| Canvas | `<canvas id="tela"></canvas>` | **Nada funciona** |

A tabela vai do mais fácil (nada parte) ao mais arriscado (nada funciona).

### Níveis sugeridos

1. **Nível 1 (recomendado para 14 anos):** tirar os textos e os 7 botões. É seguro, porque a página funciona pelo teclado enquanto eles fazem os botões.
2. **Nível 2:** tirar também a caixa de acumular, o botão de download e o inspetor.
3. **Nível 3:** deixar o `<body>` só com `<script src="script.js"></script>`. Escrever no quadro a lista dos `id`: `escolher-foto`, `tela`, `acumular`, `mensagem`, `descarregar`, `amostra-cor`, `info-posicao`, `info-rgb`.

### Regras para dizer aos ninjas

- O `<script src="script.js">` fica sempre **no fim do `<body>`**, depois dos elementos que criarem. Se ficar antes, o JavaScript procura elementos que ainda não existem.
- Não mexer no `<link rel="stylesheet">` do `<head>`.
- As classes (`class="botoes"`, `class="destaque"`, `class="amostra"`…) só mudam o aspeto. Sem elas fica feio, mas funciona.
- Não é preciso mexer no CSS do canvas: ele começa escondido e o JavaScript mostra-o quando a foto carrega.

**Erro típico na consola:** `Cannot read properties of null (reading 'addEventListener')` ou `(reading 'checked')`. Quer dizer que falta um elemento ou que o `id` está mal escrito. A linha indicada na consola mostra qual.

## Problemas comuns

Primeiro passo em quase todos os casos: abrir a consola (F12) e ler o erro a vermelho com o ninja.

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Carrego no botão e nada muda | Ainda não escreveu o filtro, ou não gravou o ficheiro | Gravar (Ctrl+S) e recarregar (F5) |
| Nada funciona, nem os botões que já funcionavam | Erro de sintaxe: falta `}` ou `)` | Ver a linha indicada na consola |
| A imagem fica toda preta ou toda de uma cor | Mexeu em `data[i]` sem `+ 1` / `+ 2`, ou o ciclo usa `i++` | Confirmar `i += 4` e os índices |
| A imagem fica transparente ou desaparece | Mexeu em `data[i + 3]` (o alfa) | Só mexer em `i`, `i + 1` e `i + 2` |
| `data is not defined` | Escreveu o código fora da função do filtro | Pôr o código no sítio do `✏️ A TUA VEZ` |
| Troca de canais dá cores esquisitas iguais | Não guardou os valores antigos | Guardar `r`, `g`, `b` em variáveis primeiro |
| Glitch muito lento ou página bloqueia | Foto enorme (fotos de telemóvel têm 12+ milhões de pixels) | Usar uma foto mais pequena |
| Os filtros juntam-se uns aos outros | A caixa "Acumular filtros" está ligada | Desligar, ou carregar em 0 |
| As teclas 0–6 não fazem nada | O foco está noutro sítio (ex.: barra de endereços) | Clicar na página primeiro |

## Desafios extra

Para quem acaba cedo, por ordem de dificuldade. Podem mudar um filtro existente para testar.

1. **Verde zombie / azul fantasma** — como o filtro vermelho, mas a deixar só o verde ou só o azul.
2. **Cinzento mais realista** — o olho vê mais o verde: `0.3 * r + 0.59 * g + 0.11 * b` em vez da média.
3. **Preto e branco puro** — depois da média, se for maior que 128 põe 255, senão põe 0.
4. **Laranja abóbora** — aumentar R e um pouco de G, baixar B (usar `Math.min` para não passar de 255).
5. **Espelho** — trocar o pixel x com o pixel `largura - 1 - x` (usa a fórmula do Glitch e a `copia`).
6. **Glitch só num canal** — empurrar apenas o vermelho, para aquele efeito de óculos 3D.
