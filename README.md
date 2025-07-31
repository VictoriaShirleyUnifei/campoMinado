# 🧨 Campo Minado - React Native com Expo

Um jogo clássico de **Campo Minado**, desenvolvido em **React Native** utilizando **Expo**. O projeto oferece um visual temático claro/escuro, níveis de dificuldade, animações e interação intuitiva para dispositivos móveis.


## 🚀 Funcionalidades

- 🎮 Início e reinício do jogo
- 👣 Três níveis de dificuldade: fácil, médio e difícil
- 🟩 Campo adaptável ao tamanho da tela
- 💣 Indicação visual de bombas ao perder
- 🧠 Lógica completa de contagem de bombas vizinhas
- 🎉 Alertas de vitória e derrota
- 🌗 Suporte a temas claro e escuro (usando hook de esquema de cor)
- 🧾 Mensagens temáticas conforme o resultado


## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- Context API para estado global
- Hooks personalizados para tema



## ▶️ Como executar

1. Clone o repositório

2. Instale as dependências:

```bash
npm install
```

3. Rode o app:
```bash
npx expo start
```

## 📁 Estrutura de Pastas

```bash
📦 app
 ┣ 📂(tabs)            # Navegação por tabs 
 ┃ ┣ _layout.tsx         # Layout das tabs
 ┃ ┣ index.tsx           # Tab inicial que contem o jogo  
 ┃ ┗ menu.tsx            # Menu do jogo   
 ┣ 📜 _layout.tsx      # Layout raiz da aplicação
 ┗ 📜 +not-found.tsx   # Tela de fallback

📦 assets
 ┣ 📂fonts              # Fontes customizadas
 ┗ 📂images             # Ícones, splash screen, logo e imagens adaptativas

📦 components
 ┗ 📂ui                 # Componentes reutilizáveis (ThemedTExt, ThemedView, Collapsible...)

📦 constants
 ┗ 📜 Colors.ts         # Paleta de cores e temas

📦 context
 ┣ 📜 CampoProvider.tsx # Estado global para o jogo
 ┗ 📜 ThemeProvider.tsx # Estado global do tema (claro/escuro)

📦 hooks
 ┣ 📜 useColorScheme.ts # Detecta se o usuário está em modo escuro/claro
 ┗ 📜 useThemeColor.ts  # Hook para aplicar tema nos componentes

📦 scripts
 ┗ 📜 game.ts           # Lógica principal do jogo (geração de tabuleiro, bombas, etc.)

📜 app.json             # Configurações do app (ícone, splash, nome, etc)
📜 README.md            # Documentação do projeto
📜 tsconfig.json        # Configuração TypeScript
📜 package.json         # Dependências e scripts
```