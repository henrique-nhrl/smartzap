#!/bin/bash

echo "=== Preparando ambiente para deploy com Traefik ==="

# 1. Criar as redes do Swarm
echo "1. Criando redes..."
docker network create -d overlay --attachable smartzap_net 2>/dev/null || echo "Rede smartzap_net já existe"
docker network create -d overlay --attachable traefik_network 2>/dev/null || echo "Rede traefik_network já existe"

# 2. Conectar ao Traefik (se existir)
echo "2. Conectando ao Traefik..."
docker network connect traefik_network $(docker ps -q --filter "name=traefik") 2>/dev/null || echo "Traefik não encontrado ou já conectado"

# 3. Build das imagens
echo "3. Fazendo build das imagens..."
cd frontEnd
docker build -t frontend:latest .
cd ../backEnd
docker build -t backend:latest .
cd ..

# 4. Deploy no Swarm
echo "4. Fazendo deploy no Swarm..."
docker stack deploy -c docker-compose.yml smartzap

echo "=== Deploy concluído! ==="
echo "Para verificar: docker stack services smartzap"
echo "Acesse: https://app.smartzap.net"
