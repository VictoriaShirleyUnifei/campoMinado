//Crie uma função que receba o número de linhas e de colunas
// que seu campo minado terá. Essa função deverá criar e retornar
// uma matriz sendo que cada elemento dessa matriz recebe um objeto Square como default.
// Ou seja, se você recebe 5 linhas e 5 colunas, você retornará uma matriz com 25 objetos Square.

// Tipagem para o Square
export type Square = {
  row: number;
  column: number;
  state: "closed" | "opened" | "flagged";
  hasMine: boolean;
  nearMines: number;
  flagged: boolean;
};

// Tipagem para matriz do campo minado
export type CampoMinado = Square[][];

export function criarSquare(row: number, column: number): Square {
  return {
    row,
    column,
    state: "closed",
    hasMine: false,
    nearMines: 0,
    flagged: false,
  };
}

export function criarCampoMinado(linhas: number, colunas: number): CampoMinado {
  const matriz: CampoMinado = [];
  for (let i = 0; i < linhas; i++) {
    const linha: Square[] = [];
    for (let j = 0; j < colunas; j++) {
      linha.push(criarSquare(i, j));
    }
    matriz.push(linha);
  }
  return matriz;
}

// Crie uma função para sortear as minas.
// Essa função receberá  uma matriz e a quantidade de minas.
// Você deve sortear uma linha e uma coluna e mudar o hasMine para true.
// Dica: utilize while para ir sorteando as bombas e ir verificando se já não tem uma bomba no lugar.

export function sortearMinas(matriz: CampoMinado, quantidadeMinas: number): void {
  const linhas = matriz.length;
  const colunas = matriz[0].length;
  let minasColocadas = 0;

  while (minasColocadas < quantidadeMinas) {
    const i = Math.floor(Math.random() * linhas);
    const j = Math.floor(Math.random() * colunas);

    if (!matriz[i][j].hasMine) {
      matriz[i][j].hasMine = true;
      minasColocadas++;
    }
  }
}

//Crie uma função para contar quantas bombas tem ao redor do quadrado.
//Essa função deverá receber a matriz, o número da linha e o número da coluna.
//Após realizar a contagem de bombas vizinhas insira esse valor no parâmetro nearMines.
// Dica: Se atente aos quadrados que ficam na margem, eles tem menos vizinhos.

export function contarBombasVizinhas(
  matriz: CampoMinado,
  linha: number,
  coluna: number
): void {
  const direcoes: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const linhas = matriz.length;
  const colunas = matriz[0].length;
  let contador = 0;

  for (const [dx, dy] of direcoes) {
    const ni = linha + dx;
    const nj = coluna + dy;

    if (ni >= 0 && ni < linhas && nj >= 0 && nj < colunas) {
      if (matriz[ni][nj].hasMine) {
        contador++;
      }
    }
  }

  matriz[linha][coluna].nearMines = contador;
}

//Crie uma função para contar bombas de todo campo, ou seja,
//ela receberá uma matriz como parâmetro e internamente chamará a função anterior
//para cada elemento da matriz, sendo assim, ela precisa percorrer a matriz
// e chamar a função de contar bombas para cada objeto.

export function atualizarBombasCampo(matriz: CampoMinado): void {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      contarBombasVizinhas(matriz, i, j);
    }
  }
}

//Crie uma função para imprimir a matriz no console,
//essa função receberá uma matriz como parâmetro.
//Você deve escolher um símbolo para representar sua bomba,
//como exemplo o * e caso não tenha bomba mostrar a quantidade de bombas vizinhas,
//se a quantidade for zero mostre um espaço em branco.
//Não se esqueça de cercar cada elemento com um par de [] para facilitar a visualização.

export function imprimirMatriz(matriz: CampoMinado): string {
  let resultado = "";
  for (const linha of matriz) {
    let linhaStr = "";
    for (const celula of linha) {
      if (celula.hasMine) {
        linhaStr += "[*]";
      } else if (celula.nearMines === 0) {
        linhaStr += "[ ]";
      } else {
        linhaStr += `[${celula.nearMines}]`;
      }
    }
    resultado += linhaStr + "\n";
  }
  return resultado; 
}

// Execução de teste
// const campoMinado: CampoMinado = criarCampoMinado(5, 5);
// const gabaritoCampoMinado: CampoMinado = JSON.parse(JSON.stringify(campoMinado));

// sortearMinas(gabaritoCampoMinado, 5);
// atualizarBombasCampo(gabaritoCampoMinado);

// console.log('Campo do jogador:');
// imprimirMatriz(campoMinado);

// console.log('\nGabarito (com minas):');
// imprimirMatriz(gabaritoCampoMinado);
