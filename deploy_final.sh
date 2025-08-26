#!/bin/bash

echo "=== Deploy Final SmartZap ==="

# 1. Parar stack anterior (se existir)
echo "1. Parando stack anterior..."
docker stack rm smartzap 2>/dev/null || true
sleep 10

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
echo "Acesse: http://seu-ip:8080"
echo "Para verificar: docker stack services smartzap"
echo "Para logs: docker service logs smartzap_frontend"
