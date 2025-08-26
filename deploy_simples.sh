#!/bin/bash

echo "=== Deploy Simples (sem Traefik) ==="

# 1. Parar stack anterior (se existir)
echo "1. Parando stack anterior..."
docker stack rm smartzap 2>/dev/null || true
sleep 10

# 2. Criar rede
echo "2. Criando rede..."
docker network create -d overlay --attachable smartzap_net 2>/dev/null || echo "Rede já existe"

# 3. Build das imagens
echo "3. Fazendo build das imagens..."
cd frontEnd
docker build -t frontend:latest .
cd ../backEnd
docker build -t backend:latest .
cd ..

# 4. Criar docker-compose simples
echo "4. Criando docker-compose simples..."
cat > docker-compose-simples.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: frontend:latest
    networks:
      - smartzap_net
    ports:
      - "8080:80"
      - "8443:443"
    depends_on:
      - backend
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

  backend:
    image: backend:latest
    networks:
      - smartzap_net
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

networks:
  smartzap_net:
    external: true
EOF

# 5. Deploy
echo "5. Fazendo deploy..."
docker stack deploy -c docker-compose-simples.yml smartzap

echo "=== Deploy concluído! ==="
echo "Acesse: http://seu-ip:8080"
echo "Para verificar: docker stack services smartzap"
