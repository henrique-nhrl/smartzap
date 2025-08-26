#!/bin/bash

# Script para renovar certificados SSL usando o Certbot
# Este script renova todos os certificados configurados

echo "Iniciando renovação de certificados SSL..."

# Renova os certificados usando o Certbot
certbot renew --quiet

# Verifica se a renovação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Certificados renovados com sucesso!"
    
    # Reinicia o Nginx para aplicar os certificados renovados
    echo "Reiniciando o Nginx..."
    nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo "Nginx reiniciado com sucesso!"
    else
        echo "Erro ao reiniciar o Nginx. Verifique a configuração."
        exit 1
    fi
else
    echo "Erro na renovação dos certificados!"
    exit 1
fi

echo "Processo de renovação concluído!"
