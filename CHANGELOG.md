# Changelog - SmartZap

## Versão 2.0.1 - Correções Docker Swarm

### Correções de Compatibilidade
- Removido `container_name` (deprecated no Docker Swarm)
- Removido `expose` (desnecessário em redes overlay)
- Removido `ports` do docker-compose.yml principal (usando Traefik)
- Adicionado labels para Traefik
- Criado `docker-compose-nginx.yml` para deploy sem Traefik

### Novos Scripts
- `check-traefik.ps1` - Verifica se o Traefik está rodando
- `docker-compose-nginx.yml` - Configuração alternativa sem Traefik

### Scripts Atualizados
- `deploy.sh` e `deploy.ps1` - Agora oferecem opções de deploy
- Opção 1: Com Traefik (portas 80/443)
- Opção 2: Com Nginx direto (portas 8080/8443)

## Versão 2.0.0 - Adaptação para Docker Swarm

### Alterações Principais

#### Domínios Atualizados
- **Frontend**: `app.smartzap.net` → `app-dev.smartzap.net`
- **API Externa**: `5.161.236.185:8080` → `evoapi2-dev.smartzap.net`

#### Configuração Docker Swarm
- Adaptado `docker-compose.yml` para modo swarm
- Configurado rede overlay
- Adicionado restart policies e update configs
- Configurado volumes para certificados SSL

#### Certificados SSL
- Criado script `generate_certs.sh` para Linux
- Criado script `generate_certs.ps1` para Windows
- Configurado nginx para usar certificados do diretório `./certs/`
- Atualizado Dockerfile do frontend para suportar certificados dinâmicos

#### Scripts de Automação
- `deploy.sh` / `deploy.ps1` - Deploy completo no Docker Swarm
- `build-images.sh` / `build-images.ps1` - Build das imagens Docker
- `renew_certs.sh` - Renovação automática de certificados (Linux)

#### Configurações de Ambiente
- Atualizado `environment.ts` e `environment.prod.ts`
- Configurado para usar novos domínios
- Mantido suporte para desenvolvimento local

#### Arquivos de Configuração
- Atualizado `nginx.conf` para novos domínios
- Criado `portainer-stack.yml` para deploy via Portainer
- Atualizado `.gitignore` para excluir certificados
- Criado `.dockerignore` para otimizar builds

### Arquivos Criados
- `generate_certs.sh` - Script Linux para gerar certificados
- `generate_certs.ps1` - Script Windows para gerar certificados
- `deploy.sh` - Script Linux para deploy
- `deploy.ps1` - Script Windows para deploy
- `build-images.sh` - Script Linux para build de imagens
- `build-images.ps1` - Script Windows para build de imagens
- `renew_certs.sh` - Script para renovar certificados
- `portainer-stack.yml` - Configuração para Portainer
- `.dockerignore` - Otimização de builds Docker
- `CHANGELOG.md` - Este arquivo

### Arquivos Modificados
- `docker-compose.yml` - Adaptado para Docker Swarm
- `frontEnd/nginx.conf` - Novos domínios e certificados
- `frontEnd/src/environments/environment.ts` - Novos domínios
- `frontEnd/src/environments/environment.prod.ts` - Novos domínios
- `frontEnd/Dockerfile` - Suporte a certificados dinâmicos
- `.gitignore` - Exclusão de certificados e arquivos sensíveis
- `README.md` - Instruções completas atualizadas

### Instruções de Deploy

#### Linux
```bash
# 1. Gerar certificados
chmod +x generate_certs.sh
./generate_certs.sh

# 2. Deploy
chmod +x deploy.sh
./deploy.sh
```

#### Windows
```powershell
# 1. Gerar certificados
.\generate_certs.ps1

# 2. Deploy
.\deploy.ps1
```

### Compatibilidade
- ✅ Docker Swarm
- ✅ Portainer
- ✅ Linux e Windows
- ✅ Certificados SSL automáticos
- ✅ Renovação automática de certificados
- ✅ Escalabilidade horizontal
- ✅ Rollback automático

### Próximos Passos
1. Configurar domínio `app-dev.smartzap.net` no DNS
2. Configurar domínio `evoapi2-dev.smartzap.net` no DNS
3. Executar scripts de certificados no servidor
4. Fazer deploy via Docker Swarm
5. Configurar renovação automática de certificados
