#!/bin/bash

echo "=== Preparando ambiente para deploy com Traefik ==="

# 1. Detectar a rede do Traefik
echo "1. Detectando rede do Traefik..."
TRAEFIK_NETWORK=$(docker network ls --format "{{.Name}}" | grep -i traefik | head -1)

if [ -z "$TRAEFIK_NETWORK" ]; then
    echo "ERRO: Rede do Traefik não encontrada!"
    echo "Redes disponíveis:"
    docker network ls
    exit 1
fi

echo "Rede do Traefik encontrada: $TRAEFIK_NETWORK"

# 2. Criar a rede do Swarm
echo "2. Criando rede smartzap_net..."
docker network create -d overlay --attachable smartzap_net 2>/dev/null || echo "Rede smartzap_net já existe"

# 3. Build das imagens
echo "3. Fazendo build das imagens..."
cd frontEnd
docker build -t frontend:latest .
cd ../backEnd
docker build -t backend:latest .
cd ..

# 4. Atualizar docker-compose.yml com a rede correta
echo "4. Atualizando docker-compose.yml..."
sed -i "s/traefik_network/$TRAEFIK_NETWORK/g" docker-compose.yml

# 5. Deploy no Swarm
echo "5. Fazendo deploy no Swarm..."
docker stack deploy -c docker-compose.yml smartzap

echo "=== Deploy concluído! ==="
echo "Para verificar: docker stack services smartzap"
echo "Acesse: https://app.smartzap.net"
