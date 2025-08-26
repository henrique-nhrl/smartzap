#!/bin/bash

# Script para gerar certificados SSL para app-dev.smartzap.net
# Este script deve ser executado no servidor onde o domínio está configurado

echo "=== Gerando certificados SSL para app-dev.smartzap.net ==="

# Verifica se o certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo "Certbot não encontrado. Instalando..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot
    else
        echo "Sistema não suportado. Instale o certbot manualmente."
        exit 1
    fi
fi

# Cria diretório para certificados se não existir
sudo mkdir -p ./certs

# Para o nginx temporariamente se estiver rodando
if pgrep nginx > /dev/null; then
    echo "Parando nginx temporariamente..."
    sudo systemctl stop nginx || sudo service nginx stop || true
fi

# Gera certificado usando certbot standalone
echo "Gerando certificado SSL..."
sudo certbot certonly --standalone \
    --email admin@smartzap.net \
    --agree-tos \
    --no-eff-email \
    -d app-dev.smartzap.net

# Verifica se o certificado foi gerado com sucesso
if [ -f "/etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem" ]; then
    echo "Certificado gerado com sucesso!"
    
    # Copia os certificados para o diretório local
    echo "Copiando certificados para ./certs..."
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
    
    echo "Certificados copiados para ./certs/"
    echo "Agora você pode fazer deploy do Docker Swarm!"
else
    echo "Erro: Certificado não foi gerado. Verifique se o domínio app-dev.smartzap.net está apontando para este servidor."
    exit 1
fi

# Reinicia nginx se estava rodando
if pgrep nginx > /dev/null 2>&1; then
    echo "Reiniciando nginx..."
    sudo systemctl start nginx || sudo service nginx start || true
fi

echo "=== Processo concluído! ==="
echo "Certificados disponíveis em: ./certs/"
echo "Para renovar automaticamente, adicione ao crontab:"
echo "0 12 * * * /usr/bin/certbot renew --quiet"
