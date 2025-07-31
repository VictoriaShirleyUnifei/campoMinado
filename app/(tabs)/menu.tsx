import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCampo } from "@/context/CampoProvider";
import { useAppTheme } from "@/context/ThemeProvider";
import {
  atualizarBombasCampo,
  CampoMinado,
  criarCampoMinado,
  imprimirMatriz,
  sortearMinas,
} from "@/scripts/game";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

export default function TabTwoScreen() {
  const { theme, setTheme } = useAppTheme();
  const { dificuldade, setDificuldade, rows, setRows, cols, setCols } =
    useCampo();

  const [campoMinadoString, setCampoMinadoString] = useState("");

  const isDark = theme === "dark";
  const textColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#ccc" : "#444";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  // Atualiza rows e cols quando dificuldade muda
  useEffect(() => {
    switch (dificuldade) {
      case "facil":
        setRows(8);
        setCols(8);
        break;
      case "medio":
        setRows(12);
        setCols(12);
        break;
      case "dificil":
        setRows(16);
        setCols(16);
        break;
    }
  }, [dificuldade]);

  useEffect(() => {
    const linhasNum = rows;
    const colunasNum = cols;

    const matriz: CampoMinado = criarCampoMinado(linhasNum, colunasNum);
    const quantidadeMinas = Math.floor(linhasNum * colunasNum * 0.2);

    sortearMinas(matriz, quantidadeMinas);
    atualizarBombasCampo(matriz);

    setCampoMinadoString(imprimirMatriz(matriz));
  }, [rows, cols]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.screen}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Menu</ThemedText>
        </ThemedView>

        {/* Tema */}
        <ThemedView style={styles.optionRow}>
          <ThemedText>Modo Escuro</ThemedText>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </ThemedView>

        {/* Dificuldade */}
        <ThemedView style={styles.optionRow}>
          <ThemedText>Dificuldade</ThemedText>

          <View
            style={{
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 8,
              overflow: "hidden",
              width: 160,
            }}
          >
            <Picker
              selectedValue={dificuldade}
              style={{ color: textColor }}
              onValueChange={(value) => setDificuldade(value)}
            >
              <Picker.Item label="Fácil" value="facil" />
              <Picker.Item label="Médio" value="medio" />
              <Picker.Item label="Difícil" value="dificil" />
            </Picker>
          </View>
        </ThemedView>
        <ThemedText style={styles.footer}>Feito com 💙 por Victória</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    minHeight: 500,
    paddingBottom: 40,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 80,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    padding: 16,
    backgroundColor: "transparent",
  },
});
