# Étape 1: Build de l'application avec Node.js
FROM node:18 as build

WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Build du projet pour la production
RUN npm run build

# Étape 2: Utiliser un serveur pour servir les fichiers
FROM node:18

WORKDIR /app

# Copier les fichiers buildés
COPY --from=build /app/dist .

# Installer http-server pour servir les fichiers
RUN npm install -g http-server

# Exposer le port 5173
EXPOSE 5173

# Commande de démarrage de http-server
CMD ["http-server", ".", "-p", "5173"]
