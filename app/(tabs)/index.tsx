import { ExplosionWave } from "@/components/ExplosionWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCampo } from "@/context/CampoProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  atualizarBombasCampo,
  CampoMinado,
  criarCampoMinado,
  sortearMinas,
  Square,
} from "@/scripts/game";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
  const theme = useColorScheme();
  const [campoMinado, setCampoMinado] = useState<CampoMinado>([]);
  const [jogoAtivo, setJogoAtivo] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const isDark = theme === "dark";
  const mensagemCor = isDark ? "#fff" : "#000";

  const { width, height } = useWindowDimensions();
  const { rows, cols } = useCampo();

  // Configurações de margem e borda
  const marginBetweenSquares = 4;
  const borderWidth = 1;

  // Calcular tamanho máximo para quadrado baseado em largura e altura
  const availableWidth = width - 32; // 16px padding horizontal * 2
  const availableHeight = height - 220; 

  // Largura máxima por quadrado (considerando margens e bordas)
  const squareWidth =
    (availableWidth - marginBetweenSquares * (cols - 1) - borderWidth * 2 * cols) / cols;
  // Altura máxima por quadrado (considerando margens e bordas)
  const squareHeight =
    (availableHeight - marginBetweenSquares * (rows - 1) - borderWidth * 2 * rows) / rows;

  // Usar o menor para garantir que caiba na tela
  const squareSize = Math.floor(
    Math.min(squareWidth, squareHeight) - 2 
  );

  // Recria o campo automaticamente quando rows ou cols mudam
  useEffect(() => {
    if (rows > 2 && cols > 2) {
      const matriz = criarCampoMinado(rows, cols);
      const minas = Math.floor(rows * cols * 0.15);
      sortearMinas(matriz, minas);
      atualizarBombasCampo(matriz);

      setCampoMinado(matriz);
      setJogoAtivo(true);
    } else {
      setCampoMinado([]);
      setJogoAtivo(false);
      setMensagem("⚠️ Número de linhas e colunas inválido.");
    }
  }, [rows, cols]);

  const iniciarJogo = () => {
    // Caso queira manter o botão para reiniciar manualmente
    if (rows <= 2 || cols <= 2) {
      setMensagem("⚠️ Número de linhas e colunas inválido.");
      return;
    }
    const matriz = criarCampoMinado(rows, cols);
    const minas = Math.floor(rows * cols * 0.15);
    sortearMinas(matriz, minas);
    atualizarBombasCampo(matriz);

    setCampoMinado(matriz);
    setJogoAtivo(true);
    setMensagem("");
  };

  const abrirQuadradoRecursivo = (campo: CampoMinado, row: number, col: number) => {
    const dentroDosLimites = (r: number, c: number) =>
      r >= 0 && r < campo.length && c >= 0 && c < campo[0].length;

    const abrir = (r: number, c: number) => {
      const q = campo[r][c];
      if (q.state !== "closed" || q.flagged) return;

      q.state = "opened";

      if (!q.hasMine && q.nearMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (dentroDosLimites(nr, nc)) {
              abrir(nr, nc);
            }
          }
        }
      }
    };

    abrir(row, col);
  };

  const handleAbrirQuadrado = (row: number, column: number) => {
    if (!jogoAtivo) return;

    setCampoMinado((prevCampo) => {
      const novoCampo = prevCampo.map((linha) =>
        linha.map((q) => ({ ...q }))
      );

      const quadrado = novoCampo[row][column];
      if (quadrado.state === "closed" && !quadrado.flagged) {
        if (quadrado.hasMine) {
          quadrado.state = "opened";

          // Revela todas as minas no campo
          for (let r = 0; r < novoCampo.length; r++) {
            for (let c = 0; c < novoCampo[0].length; c++) {
              const q = novoCampo[r][c];
              if (q.hasMine) {
                q.state = "opened";
              }
            }
          }

          setJogoAtivo(false);
          Alert.alert("💥 Você clicou em uma bomba!");
          return novoCampo;
        }

        abrirQuadradoRecursivo(novoCampo, row, column);

        const todosAbertos = novoCampo.every((linha) =>
          linha.every((q) => q.hasMine || q.state === "opened")
        );

        
        if (todosAbertos) {
          setJogoAtivo(false);
          Alert.alert("🎉 Parabéns, você venceu!");
        }
      }

      return novoCampo;
    });
  };

  const handleToggleFlag = (row: number, column: number) => {
    if (!jogoAtivo) return;

    setCampoMinado((prevCampo) => {
      const novoCampo = prevCampo.map((linha) =>
        linha.map((q) => ({ ...q }))
      );

      const quadrado = novoCampo[row][column];
      if (quadrado.state === "closed") {
        quadrado.flagged = !quadrado.flagged;
      }

      return novoCampo;
    });
  };

  const banner =
    theme === "dark"
      ? require("@/assets/images/banner-dark.png")
      : require("@/assets/images/banner-light.png");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#c9f4f5", dark: "#267abe" }}
      headerImage={<Image source={banner} style={styles.banner} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Campo Minado</ThemedText>
        <ExplosionWave />
      </ThemedView>

      {mensagem !== "" && (
        <Text style={[styles.messageText, { color: mensagemCor }]}>{mensagem}</Text>
      )}

      <View style={styles.container}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            {campoMinado.map((linha, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {linha.map((square: Square, colIndex) => (
                 <Pressable
                     key={`${square.row}-${square.column}`}
                onPress={() => handleAbrirQuadrado(square.row, square.column)}
                onLongPress={() => handleToggleFlag(square.row, square.column)}
                style={{
                  width: squareSize,
                  height: squareSize,
                  marginRight: colIndex < cols - 1 ? marginBetweenSquares : 0,
                  borderWidth,
                  borderColor: "#555",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: square.state === "opened" ? "#ddd" : "#888",
                }}
                  >
                    {square.state === "opened" && (
                      <Text style={styles.squareText}>
                        {square.hasMine ? "💥" : square.nearMines || ""}
                      </Text>
                    )}
                    {square.state === "closed" && square.flagged && (
                      <Text style={styles.squareText}>🚩</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.buttonStart} onPress={iniciarJogo}>
          <Text style={styles.buttonText}>▶️ Novo Jogo</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 20,
  },
  banner: {
    height: 280,
    width: "70%",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  square: {
    borderWidth: 1,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  squareText: {
    fontWeight: "bold",
    fontSize: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 12,
  },
  buttonStart: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonEnd: {
    backgroundColor: "#f44336",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  messageText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
});
