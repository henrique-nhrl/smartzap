#!/bin/bash

echo "=== Preparando ambiente para deploy ==="

# 1. Criar a rede do Swarm
echo "1. Criando rede smartzap_net..."
docker network create -d overlay --attachable smartzap_net 2>/dev/null || echo "Rede já existe"

# 2. Build das imagens
echo "2. Fazendo build das imagens..."
cd frontEnd
docker build -t frontend:latest .
cd ../backEnd
docker build -t backend:latest .
cd ..

# 3. Deploy no Swarm
echo "3. Fazendo deploy no Swarm..."
docker stack deploy -c docker-compose.yml smartzap

echo "=== Deploy concluído! ==="
echo "Para verificar: docker stack services smartzap"
