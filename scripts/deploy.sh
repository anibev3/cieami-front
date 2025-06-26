#!/bin/bash

# Script de déploiement pour Expert Auto
# Usage: ./scripts/deploy.sh [environment]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR="dist"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${GREEN}🚀 Démarrage du déploiement Expert Auto${NC}"
echo -e "${YELLOW}Environnement: ${ENVIRONMENT}${NC}"

# Vérification des prérequis
echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis vérifiés${NC}"

# Nettoyage
echo -e "${YELLOW}🧹 Nettoyage des anciens builds...${NC}"
rm -rf $BUILD_DIR
echo -e "${GREEN}✅ Nettoyage terminé${NC}"

# Installation des dépendances
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✅ Dépendances installées${NC}"

# Build de production
echo -e "${YELLOW}🔨 Build de production...${NC}"
pnpm build:prod
echo -e "${GREEN}✅ Build terminé${NC}"

# Vérification du build
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo -e "${RED}❌ Le build a échoué - index.html manquant${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build vérifié${NC}"

# Statistiques du build
echo -e "${YELLOW}📊 Statistiques du build:${NC}"
echo "Taille du dossier dist: $(du -sh $BUILD_DIR | cut -f1)"
echo "Nombre de fichiers: $(find $BUILD_DIR -type f | wc -l)"

# Sauvegarde (si déploiement sur serveur)
if [ "$ENVIRONMENT" = "production" ] && [ -d "/var/www/html" ]; then
    echo -e "${YELLOW}💾 Sauvegarde de l'ancienne version...${NC}"
    if [ -d "/var/www/html" ]; then
        cp -r /var/www/html $BACKUP_DIR
        echo -e "${GREEN}✅ Sauvegarde créée: $BACKUP_DIR${NC}"
    fi
fi

# Déploiement
echo -e "${YELLOW}🚀 Déploiement...${NC}"

if [ "$ENVIRONMENT" = "production" ] && [ -d "/var/www/html" ]; then
    # Déploiement sur serveur Apache
    sudo rm -rf /var/www/html/*
    sudo cp -r $BUILD_DIR/* /var/www/html/
    sudo chown -R www-data:www-data /var/www/html
    sudo chmod -R 755 /var/www/html
    echo -e "${GREEN}✅ Déployé sur /var/www/html${NC}"
elif [ "$ENVIRONMENT" = "staging" ]; then
    # Déploiement staging
    echo -e "${GREEN}✅ Build prêt pour staging dans $BUILD_DIR${NC}"
else
    # Déploiement local
    echo -e "${GREEN}✅ Build prêt dans $BUILD_DIR${NC}"
    echo -e "${YELLOW}Pour tester localement: pnpm preview${NC}"
fi

# Nettoyage des sauvegardes anciennes (garder seulement les 5 dernières)
if [ -d "backup-"* ]; then
    echo -e "${YELLOW}🧹 Nettoyage des anciennes sauvegardes...${NC}"
    ls -dt backup-* | tail -n +6 | xargs -r rm -rf
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
fi

echo -e "${GREEN}🎉 Déploiement terminé avec succès!${NC}"

# Informations supplémentaires
echo -e "${YELLOW}📋 Informations:${NC}"
echo "- Build disponible dans: $BUILD_DIR"
echo "- Environnement: $ENVIRONMENT"
echo "- Date: $(date)"
echo "- Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"

if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${GREEN}🌐 Application accessible sur votre serveur web${NC}"
fi 