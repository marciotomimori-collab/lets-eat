# 🍽️ Let's Eat

**Descubra onde comer hoje!** — App mobile (iOS & Android) que ajuda pessoas a decidir onde comer, combinando busca personalizada, modo surpresa com gamificação, e avaliações da comunidade.

## ✨ Features

- 🔍 **Busca Personalizada** — Filtre por tipo de cozinha, evento, faixa de preço e raio
- 🎲 **Modo Surpresa** — Arraste o prato para revelar um restaurante aleatório (4.5+ ⭐)
- ⭐ **Avaliações** — Sistema de reviews da comunidade com notas e comentários
- 🏆 **Conquistas** — 12 conquistas gamificadas (Volta ao Mundo, Crítico Gastronômico, etc.)
- 🌐 **Bilíngue** — Português (BR) e Inglês
- 🔒 **Privacidade (LGPD)** — Exportação e exclusão total de dados do usuário
- 👤 **Login Flexível** — Convidado anônimo, Google OAuth, ou E-mail/Senha

## 🛠 Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Framework** | React Native (Expo SDK 57) |
| **Navegação** | Expo Router (file-based) |
| **Backend** | Firebase (Auth + Firestore) |
| **API de Restaurantes** | Google Places API (New) |
| **Estado** | Zustand |
| **Internacionalização** | i18next + react-i18next |
| **Linguagem** | TypeScript |

## 📁 Estrutura do Projeto

```
lets-eat/
├── app/                    # Telas (Expo Router file-based routing)
│   ├── (auth)/             # Fluxo de autenticação
│   │   ├── welcome.tsx     # Tela de boas-vindas
│   │   ├── register.tsx    # Cadastro email/senha
│   │   └── onboarding.tsx  # Configuração de preferências
│   ├── (tabs)/             # Navegação principal (4 abas)
│   │   ├── index.tsx       # Home — "Vamos Comer?"
│   │   ├── reviews.tsx     # Avaliações
│   │   ├── achievements.tsx # Conquistas
│   │   └── settings.tsx    # Configurações
│   ├── restaurant/[id].tsx # Detalhe do restaurante
│   ├── write-review/[id].tsx # Escrever avaliação
│   ├── search-results.tsx  # Resultados de busca
│   ├── surprise.tsx        # Modo surpresa
│   └── privacy-policy.tsx  # Política de privacidade
├── components/
│   ├── ui/                 # Design system (Button, Card, Input, Chip, etc.)
│   └── home/               # Componentes do home (RestaurantCard, SearchForm, SurprisePlate)
├── constants/              # Cores, tipografia, tipos de cozinha, conquistas
├── hooks/                  # Custom hooks (useAuth, useLocation, useGooglePlaces, useAchievements)
├── i18n/                   # Configuração i18n + traduções (pt-BR, en)
├── services/
│   ├── firebase/           # Auth, Firestore CRUD
│   ├── google-places/      # API client com cache e field masks
│   └── achievements/       # Tracker de conquistas
├── stores/                 # Zustand stores (auth, user, search, achievements)
├── types/                  # TypeScript interfaces
└── utils/                  # Formatters, validators, LGPD compliance
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Conta Firebase (para Auth e Firestore)
- Chave da Google Places API

### Setup

1. Clone o repositório:
```bash
git clone https://github.com/marciotomimori-collab/lets-eat.git
cd lets-eat
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Preencha o `.env` com suas chaves:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`

4. Inicie o app:
```bash
npm start
```

### Testando

- 📱 **Dispositivo físico**: Escaneie o QR code com o app Expo Go
- 🤖 **Android Emulator**: `npm run android`
- 🍎 **iOS Simulator** (macOS): `npm run ios`
- 🌐 **Web**: `npm run web`

## 🔑 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (Email/Password, Google, Anonymous)
3. Crie um banco **Firestore** em modo test
4. Copie as credenciais para o `.env`
5. Implante as security rules: `firebase deploy --only firestore:rules`

## 🗺 Configuração do Google Places API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Ative a **Places API (New)**
3. Crie uma API Key com restrições (por app / por API)
4. Copie a chave para `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` no `.env`

## 📋 LGPD / Privacidade

O app implementa conformidade com LGPD:
- ✅ Consentimento explícito na criação da conta
- ✅ Exportação completa de dados do usuário (JSON)
- ✅ Exclusão permanente de todos os dados (perfil, reviews, conquistas, histórico)
- ✅ Dados criptografados em trânsito (HTTPS/TLS) e em repouso (Firebase AES-256)

## 📄 Licença

MIT
