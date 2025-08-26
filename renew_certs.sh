#!/bin/bash

# Script para renovar certificados SSL
echo "=== Renovando certificados SSL ==="

# Renova os certificados usando o Certbot
sudo certbot renew --quiet

# Verifica se a renovação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Certificados renovados com sucesso!"
    
    # Copia os certificados renovados para o diretório local
    echo "Copiando certificados renovados para ./certs..."
    sudo cp /etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem ./certs/
    sudo cp /etc/letsencrypt/live/app-dev.smartzap.net/privkey.pem ./certs/
    sudo cp /etc/letsencrypt/options-ssl-nginx.conf ./certs/
    sudo cp /etc/letsencrypt/ssl-dhparams.pem ./certs/
    
    # Ajusta permissões
    sudo chown -R $USER:$USER ./certs/
    chmod 644 ./certs/fullchain.pem
    chmod 600 ./certs/privkey.pem
    chmod 644 ./certs/options-ssl-nginx.conf
    chmod 644 ./certs/ssl-dhparams.pem
    
    echo "Certificados renovados copiados para ./certs/"
    
    # Reinicia o serviço Docker Swarm se estiver rodando
    if docker stack ls | grep -q "smartzap"; then
        echo "Reiniciando serviços Docker Swarm..."
        docker service update --force smartzap_frontend
    fi
else
    echo "Erro na renovação dos certificados!"
    exit 1
fi

echo "=== Renovação concluída! ==="
