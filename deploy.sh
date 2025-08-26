#!/bin/bash

# Script para deploy no Docker Swarm
echo "=== Deploy SmartZap no Docker Swarm ==="

# Verifica se o Docker Swarm está inicializado
if ! docker info | grep -q "Swarm: active"; then
    echo "Inicializando Docker Swarm..."
    docker swarm init
fi

# Verifica se os certificados existem
if [ ! -f "./certs/fullchain.pem" ] || [ ! -f "./certs/privkey.pem" ]; then
    echo "Erro: Certificados SSL não encontrados!"
    echo "Execute primeiro: ./generate_certs.sh"
    exit 1
fi

# Para o stack se estiver rodando
if docker stack ls | grep -q "smartzap"; then
    echo "Parando stack existente..."
    docker stack rm smartzap
    sleep 10
fi

# Faz o build das imagens
echo "Fazendo build das imagens..."
docker build -t smartzap-backend:latest ./backEnd
docker build -t smartzap-frontend:latest ./frontEnd

# Deploy do stack
echo "Fazendo deploy do stack..."
docker stack deploy -c docker-compose.yml smartzap

# Aguarda um pouco para os serviços iniciarem
echo "Aguardando serviços iniciarem..."
sleep 15

# Verifica o status dos serviços
echo "Status dos serviços:"
docker service ls | grep smartzap

echo "=== Deploy concluído! ==="
echo "Acesse: https://app-dev.smartzap.net"
echo ""
echo "Comandos úteis:"
echo "  Ver logs: docker service logs smartzap_frontend"
echo "  Ver logs backend: docker service logs smartzap_backend"
echo "  Escalar: docker service scale smartzap_frontend=2"
echo "  Parar: docker stack rm smartzap"
