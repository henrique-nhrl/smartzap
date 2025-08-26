#!/bin/bash

# Script para build das imagens Docker
echo "=== Build das imagens Docker ==="

# Build da imagem do backend
echo "Build da imagem do backend..."
docker build -t smartzap-backend:latest ./backEnd

# Build da imagem do frontend
echo "Build da imagem do frontend..."
docker build -t smartzap-frontend:latest ./frontEnd

echo "=== Build concluído! ==="
echo "Imagens criadas:"
echo "  - smartzap-backend:latest"
echo "  - smartzap-frontend:latest"
echo ""
echo "Para fazer deploy:"
echo "  ./deploy.sh"
