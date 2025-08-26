# SmartZap - Sistema de Mensageria

Sistema completo de mensageria com frontend Angular e backend Node.js, configurado para deploy em Docker Swarm.

## Domínios Configurados

- **Frontend**: `app-dev.smartzap.net`
- **API Externa**: `evoapi2-dev.smartzap.net`

## Pré-requisitos

- Docker e Docker Compose instalados
- Domínio `app-dev.smartzap.net` apontando para o servidor
- Acesso root/sudo no servidor (Linux) ou PowerShell como Administrador (Windows)

## Configuração Inicial

### Linux

#### 1. Gerar Certificados SSL

```bash
# Torne o script executável
chmod +x generate_certs.sh

# Execute o script para gerar certificados
./generate_certs.sh
```

#### 2. Deploy no Docker Swarm

```bash
# Torne o script executável
chmod +x deploy.sh

# Execute o deploy
./deploy.sh
```

### Windows

#### 1. Gerar Certificados SSL

```powershell
# Execute o script PowerShell para gerar certificados
.\generate_certs.ps1
```

#### 2. Verificar Traefik (Opcional)

```powershell
# Verifique se o Traefik está rodando
.\check-traefik.ps1
```

#### 3. Deploy no Docker Swarm

```powershell
# Execute o deploy
.\deploy.ps1
```

## Opções de Deploy

O script de deploy oferece duas opções:

### Opção 1: Com Traefik (Recomendado)
- Usa o Traefik como proxy reverso
- Acesso via `https://app-dev.smartzap.net`
- Requer Traefik configurado no Docker Swarm
- Certificados SSL automáticos via Let's Encrypt

### Opção 2: Com Nginx Direto
- Usa Nginx diretamente
- Acesso via `https://localhost:8443`
- Não requer Traefik
- Certificados SSL manuais

## Scripts Disponíveis

### Linux
- `generate_certs.sh` - Gera certificados SSL para o domínio
- `deploy.sh` - Faz deploy no Docker Swarm
- `renew_certs.sh` - Renova certificados SSL
- `build-images.sh` - Build das imagens Docker

### Windows
- `generate_certs.ps1` - Gera certificados SSL para o domínio
- `deploy.ps1` - Faz deploy no Docker Swarm
- `check-traefik.ps1` - Verifica se o Traefik está rodando
- `build-images.ps1` - Build das imagens Docker

## Comandos Úteis

### Docker Swarm

```bash
# Ver status dos serviços
docker service ls

# Ver logs do frontend
docker service logs smartzap_frontend

# Ver logs do backend
docker service logs smartzap_backend

# Escalar serviços
docker service scale smartzap_frontend=2

# Parar stack
docker stack rm smartzap

# Ver detalhes do stack
docker stack ps smartzap
```

### Renovação de Certificados

#### Linux
```bash
# Renovar certificados manualmente
./renew_certs.sh

# Configurar renovação automática (crontab)
0 12 * * * /caminho/completo/para/renew_certs.sh
```

#### Windows
```powershell
# Renovar certificados manualmente
certbot renew

# Configurar renovação automática via Agendador de Tarefas do Windows
```

## Estrutura do Projeto

```
SmartZap/
├── frontEnd/          # Aplicação Angular
├── backEnd/           # API Node.js
├── certs/             # Certificados SSL (gerado automaticamente)
├── docker-compose.yml # Configuração Docker Swarm com Traefik
├── docker-compose-nginx.yml # Configuração Docker Swarm com Nginx
├── generate_certs.sh  # Script para gerar certificados (Linux)
├── generate_certs.ps1 # Script para gerar certificados (Windows)
├── deploy.sh          # Script para deploy (Linux)
├── deploy.ps1         # Script para deploy (Windows)
├── check-traefik.ps1  # Script para verificar Traefik (Windows)
├── build-images.sh    # Script para build de imagens (Linux)
├── build-images.ps1   # Script para build de imagens (Windows)
└── renew_certs.sh     # Script para renovar certificados (Linux)
```

## Portas Utilizadas

### Com Traefik
- **80/443** - Traefik (proxy reverso)
- **4000** - Backend (interno)

### Com Nginx Direto
- **8080** - HTTP (redirecionamento para HTTPS)
- **8443** - HTTPS (frontend)
- **4000** - Backend (interno)

## Variáveis de Ambiente

As configurações de ambiente estão nos arquivos:
- `frontEnd/src/environments/environment.ts` (desenvolvimento)
- `frontEnd/src/environments/environment.prod.ts` (produção)

## Troubleshooting

### Certificados não funcionam
1. Verifique se o domínio está apontando para o servidor
2. Execute `./generate_certs.sh` (Linux) ou `.\generate_certs.ps1` (Windows) novamente
3. Verifique as permissões dos arquivos em `./certs/`

### Serviços não iniciam
1. Verifique os logs: `docker service logs smartzap_frontend`
2. Verifique se as portas necessárias estão livres
3. Execute `docker stack rm smartzap` e depois `./deploy.sh` ou `.\deploy.ps1`

### Conflito de portas com Traefik
1. Execute `.\check-traefik.ps1` para verificar o status
2. Use a opção 2 (Nginx direto) se Traefik não estiver configurado
3. Ou configure o Traefik corretamente antes de usar a opção 1

### Problemas de conectividade
1. Verifique se o Docker Swarm está ativo: `docker info`
2. Verifique se a rede overlay foi criada: `docker network ls`
3. Reinicie o swarm se necessário: `docker swarm leave --force && docker swarm init`

### Windows Específico
1. Certifique-se de executar PowerShell como Administrador
2. Verifique se o Docker Desktop está rodando
3. Se houver problemas com certificados, instale o Chocolatey e depois o certbot:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   choco install certbot -y
   ```
