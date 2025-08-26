#!/bin/bash

echo "=== Gerando certificado para app-dev.smartzap.net ==="

# 1. Parar os serviços do Swarm
echo "1. Parando serviços do Swarm..."
docker stack rm smartzap 2>/dev/null || true
sleep 10

# 2. Criar diretório para certificados
echo "2. Criando diretório para certificados..."
mkdir -p frontEnd/etc/letsencrypt/live/app-dev.smartzap.net

# 3. Gerar certificado usando Docker
echo "3. Gerando certificado..."
docker run -it --rm -v $(pwd)/frontEnd/etc/letsencrypt:/etc/letsencrypt -p 80:80 -p 443:443 certbot/certbot certonly --standalone -d app-dev.smartzap.net --non-interactive --agree-tos --email admin@smartzap.net

# 4. Verificar se o certificado foi gerado
if [ -f "frontEnd/etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem" ]; then
    echo "4. Certificado gerado com sucesso!"
    
    # 5. Copiar certificados para o diretório correto
    echo "5. Copiando certificados..."
    mkdir -p frontEnd/etc/nginx/certs/app-dev.smartzap.net
    cp frontEnd/etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem frontEnd/etc/nginx/certs/app-dev.smartzap.net/
    cp frontEnd/etc/letsencrypt/live/app-dev.smartzap.net/privkey.pem frontEnd/etc/nginx/certs/app-dev.smartzap.net/
    
    # 6. Reconstruir a imagem Docker
    echo "6. Reconstruindo imagem Docker..."
    cd frontEnd
    docker build -t frontend:latest .
    cd ..
    
    # 7. Fazer push da imagem para o registry (se necessário)
    echo "7. Fazendo push da imagem..."
    docker push frontend:latest 2>/dev/null || echo "Push ignorado (imagem local)"
    
    # 8. Deploy no Swarm
    echo "8. Fazendo deploy no Swarm..."
    docker stack deploy -c docker-compose.yml smartzap
    
    echo "=== Concluído! ==="
    echo "Acesse: https://app-dev.smartzap.net"
else
    echo "ERRO: Certificado não foi gerado!"
    echo "Verifique se o domínio app-dev.smartzap.net está apontando para este servidor."
fi
