# 📱 PPE - Application Mobile Santé

Bienvenue dans le dépôt de l'application mobile **PPE** développée avec **React Native** et **Expo**. Cette app vise à centraliser des informations de santé, faciliter la gestion des rendez-vous médicaux et fournir des outils de prévention accessibles à tous.

---

## 🚀 Prérequis

Avant de lancer le projet, merci de suivre les étapes suivantes :

### 1. Télécharger Expo Go

📲 Installez l’application mobile **Expo Go** sur votre smartphone :

- [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Cloner ce dépôt

Ouvrez un terminal et entrez :

```bash
git clone https://github.com/JulesDias/PPE.git
```
Puis :
```bash
cd Uplife
```
### 3. Installer Node.js
Téléchargez [Node.js](https://nodejs.org/en/download  ) :  
💡 Redémarrez votre ordinateur après l’installation.

### 4. Mettre à jour npm

```bash
npm install -g npm@10.8.3
```
### 5. Vérifier les installations

```bash
node -v
npm -v
```

## 📦 Dépendances à installer  

Voici les commandes pour installer toutes les dépendances nécessaires :

```bash
npm install expo
npx expo install react-native-web react-dom @expo/metro-runtime
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npm install @react-native-community/datetimepicker
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

## 📲 Lancer l'application avec Expo Go

Dans le terminal, accédez au dossier du projet:

```bash
cd Uplife
npx expo start -c --tunnel
```

📸 Scannez le QR code affiché dans le terminal ou le navigateur avec l'application Expo Go sur votre smartphone.  
⛔ Pour arrêter l’émulation :  
Windows : Ctrl + C  
macOS : Cmd + C

## 📁 Structure

```bash

PPE/  
├── Uplife/               # Code source de l'application  
|   ├── .expo/            # Pour émuler avec Expo Go  
│   ├── app/              # Pages principales  
│   ├── components/       # Composants réutilisables  
│   ├── assets/           # Images et fichiers statiques  
|   ├── constants/        # Variables globales (couleurs)  
|   ├── data/             # Infos des vaccins, médecins et cancers  
│   └── ...               # Autres dossiers (navigation, services, app.json...)  
├── .gitignore  
└── README.md
```

## 🧑‍💻 Auteurs
Jules Dias - [@JulesDias](https://github.com/JulesDias)  
Paul Rouxel - [@PaulRouxel](https://github.com/PaulRouxel)  
Arthur Berret - [@Atlas002](https://github.com/Atlas002)  
Gabrielle Leclerc - [@gabylclr](https://github.com/gabylclr)  



  
