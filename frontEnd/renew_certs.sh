#!/bin/bash

# Renova os certificados usando o Certbot
certbot renew --quiet

# Reinicia o Nginx para aplicar os certificados renovados
nginx -s reload
