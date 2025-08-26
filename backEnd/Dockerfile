# Use a imagem base oficial do Node.js
FROM node:14

# Instala os pacotes necessários
RUN apt-get update && apt-get install -y \
    locales \
    tzdata \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Gera e configura o locale pt_BR.UTF-8
RUN echo "pt_BR.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen pt_BR.UTF-8 && \
    update-locale LANG=pt_BR.UTF-8

# Define as variáveis de ambiente para o locale pt_BR.UTF-8
ENV LANG=pt_BR.UTF-8 \
    LANGUAGE=pt_BR:pt \
    LC_ALL=pt_BR.UTF-8

# Define o timezone para America/Sao_Paulo
RUN ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

# Crie um diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação vai rodar
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["npm", "start"]
