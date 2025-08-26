### STAGE 1: BUILD ###
FROM node:14.15-alpine AS build

# Instala os pacotes necessários
RUN apk add --no-cache \
    tzdata \
    bash \
    ca-certificates \
    wget

# Define o timezone para America/Sao_Paulo
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

# Instala o glibc
ENV GLIBC_VERSION 2.31-r0
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/$GLIBC_VERSION/glibc-$GLIBC_VERSION.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/$GLIBC_VERSION/glibc-bin-$GLIBC_VERSION.apk && \
    apk add glibc-$GLIBC_VERSION.apk glibc-bin-$GLIBC_VERSION.apk && \
    rm glibc-$GLIBC_VERSION.apk glibc-bin-$GLIBC_VERSION.apk

# Configura o locale pt_BR.UTF-8
RUN /usr/glibc-compat/bin/localedef -i pt_BR -f UTF-8 pt_BR.UTF-8 || true

# Define as variáveis de ambiente para o locale pt_BR.UTF-8
ENV LANG=pt_BR.UTF-8 \
    LANGUAGE=pt_BR:pt \
    LC_ALL=pt_BR.UTF-8

# Cria um diretório de trabalho e copia o código da aplicação
WORKDIR /dist/src/app

# Limpa o cache do npm
RUN npm cache clean --force

# Copia os arquivos da máquina local para o diretório virtual na imagem do Docker
COPY . .

# Instala as dependências da aplicação
RUN npm install
RUN npm install typescript@4.8.4 --save-dev

# Constrói a aplicação para produção
RUN npm run build --prod


### STAGE 2: RUN ###
FROM nginx:alpine

# Instala os pacotes necessários no contêiner Nginx
RUN apk add --no-cache \
    tzdata \
    bash \
    ca-certificates

# Define o timezone para America/Sao_Paulo no contêiner Nginx
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

# Define as variáveis de ambiente para o locale pt_BR.UTF-8 no contêiner Nginx
ENV LANG=pt_BR.UTF-8 \
    LANGUAGE=pt_BR:pt \
    LC_ALL=pt_BR.UTF-8

# Copia o código compilado e a configuração do nginx para a pasta correta
COPY --from=build /dist/src/app/dist/client-app /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY /etc/letsencrypt/live/app.smartzap.net/fullchain.pem /etc/nginx/fullchain.pem
COPY /etc/letsencrypt/live/app.smartzap.net/privkey.pem /etc/nginx/privkey.pem
COPY /etc/letsencrypt/options-ssl-nginx.conf /etc/nginx/options-ssl-nginx.conf
COPY /etc/letsencrypt/ssl-dhparams.pem /etc/nginx/ssl-dhparams.pem
# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
