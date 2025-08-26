# Instruções de Deploy - SmartZap com Traefik

## Visão Geral

Esta aplicação foi configurada para usar **Traefik** como reverse proxy, eliminando a necessidade de certificados SSL hardcoded e permitindo gerenciamento automático de certificados Let's Encrypt.

## Mudanças Implementadas

### 1. Segurança
- ✅ **Chave API removida do código**: A chave `0417bf43b0a8969bd6685bcb49dhkcDP` foi removida dos arquivos de ambiente
- ✅ **Variáveis de ambiente**: Todas as configurações sensíveis agora usam variáveis de ambiente
- ✅ **Certificados SSL automáticos**: Traefik gerencia automaticamente os certificados Let's Encrypt

### 2. Arquitetura
- ✅ **Traefik como reverse proxy**: Substitui o nginx com certificados hardcoded
- ✅ **Deploy via Portainer**: Configuração otimizada para Portainer
- ✅ **Variáveis de ambiente em runtime**: Frontend substitui variáveis em tempo de execução

## Pré-requisitos

1. **Portainer** instalado e configurado
2. **Docker** e **Docker Compose** funcionando
3. **Domínio** apontando para o servidor (app.smartzap.net)
4. **Porta 80 e 443** liberadas no firewall

## Passos para Deploy

### 1. Preparar as Variáveis de Ambiente

Copie o arquivo `env.example` para `.env`:

```bash
cp env.example .env
```

Edite o arquivo `.env` e configure as variáveis:

```bash
# IMPORTANTE: Altere estas chaves em produção
DEFAULT_API_KEY=sua_nova_chave_api_aqui
SECRET=sua_nova_chave_secreta_aqui

# Configure as demais variáveis conforme necessário
DB_PASS=sua_senha_do_banco
EMAIL_SENHA=sua_senha_do_email
```

### 2. Construir as Imagens Docker

No diretório raiz do projeto:

```bash
# Construir imagem do frontend
cd frontEnd
docker build -t frontend:prod-v1.0.1 .

# Construir imagem do backend
cd ../backEnd
docker build -t backend:prod-v1.0.1 .
```

### 3. Deploy via Portainer

1. **Acesse o Portainer**
2. **Vá para Stacks**
3. **Clique em "Add stack"**
4. **Nome**: `smartzap`
5. **Cole o conteúdo do `docker-compose.yml`**
6. **Clique em "Deploy the stack"**

### 4. Verificar o Deploy

1. **Acesse**: `http://app.smartzap.net` (deve redirecionar para HTTPS)
2. **Verifique os logs** em Portainer > Containers

## Estrutura dos Serviços

### Traefik (Já instalado no servidor)
- **Função**: Reverse proxy com SSL automático
- **Certificados**: Let's Encrypt automático via `letsencryptresolver`

### Frontend
- **Porta**: 80 (interno)
- **Função**: Aplicação Angular
- **URL**: https://app.smartzap.net

### Backend
- **Porta**: 4000 (interno)
- **Função**: API Node.js
- **URL**: https://app.smartzap.net/api

## Variáveis de Ambiente

### Frontend
- `DEFAULT_API_KEY`: Chave API para WhatsApp
- `API_DOMAIN`: Domínio da API
- `API_URL`: URL completa da API
- `EXTERNAL_API_URL`: URL da API externa

### Backend
- `SERVER_IP`: IP do servidor
- `SERVER_URL`: URL do servidor
- `PORT`: Porta do servidor
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configurações do banco
- `SECRET`: Chave secreta para JWT
- `EMAIL_*`: Configurações de email

## Troubleshooting

### Problemas Comuns

1. **Certificado SSL não gerado**
   - Verifique se o domínio está apontando para o servidor
   - Aguarde alguns minutos para o Let's Encrypt gerar o certificado
   - Verifique os logs do Traefik

2. **Aplicação não carrega**
   - Verifique se as variáveis de ambiente estão configuradas
   - Verifique os logs do frontend e backend
   - Confirme se as imagens foram construídas corretamente

3. **Erro de conexão com banco**
   - Verifique as credenciais do banco no arquivo `.env`
   - Confirme se o banco está acessível

### Logs Úteis

```bash
# Logs do frontend
docker logs frontend_container

# Logs do backend
docker logs backend_container
```

## Segurança

### ✅ Implementado
- Chaves removidas do código fonte
- Variáveis de ambiente para configurações sensíveis
- SSL automático com Let's Encrypt
- Headers de segurança do Traefik

### 🔒 Recomendações Adicionais
- Altere todas as chaves padrão em produção
- Use senhas fortes para banco de dados
- Configure backup automático
- Monitore logs regularmente
- Mantenha as imagens Docker atualizadas

## Backup e Restore

### Backup
```bash
# Backup das variáveis de ambiente
cp .env .env.backup

# Backup dos certificados (se necessário)
cp -r letsencrypt/ letsencrypt.backup/
```

### Restore
```bash
# Restore das variáveis
cp .env.backup .env

# Restore dos certificados
cp -r letsencrypt.backup/ letsencrypt/
```

## Suporte

Para problemas específicos:
1. Verifique os logs dos containers
2. Confirme as configurações no arquivo `.env`
3. Teste a conectividade de rede
4. Verifique se o domínio está configurado corretamente
