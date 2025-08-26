# Script PowerShell para deploy no Docker Swarm
Write-Host "=== Deploy SmartZap no Docker Swarm ===" -ForegroundColor Green

# Verifica se o Docker Swarm está inicializado
$swarmInfo = docker info 2>&1 | Select-String "Swarm: active"
if (!$swarmInfo) {
    Write-Host "Inicializando Docker Swarm..." -ForegroundColor Yellow
    docker swarm init
}

# Verifica se os certificados existem
if (!(Test-Path "./certs/fullchain.pem") -or !(Test-Path "./certs/privkey.pem")) {
    Write-Host "Erro: Certificados SSL não encontrados!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\generate_certs.ps1" -ForegroundColor Red
    exit 1
}

# Para o stack se estiver rodando
$stackExists = docker stack ls 2>&1 | Select-String "smartzap"
if ($stackExists) {
    Write-Host "Parando stack existente..." -ForegroundColor Yellow
    docker stack rm smartzap
    Start-Sleep -Seconds 10
}

# Faz o build das imagens
Write-Host "Fazendo build das imagens..." -ForegroundColor Yellow
docker build -t smartzap-backend:latest ./backEnd
docker build -t smartzap-frontend:latest ./frontEnd

# Pergunta qual configuração usar
Write-Host ""
Write-Host "Escolha a configuração de deploy:" -ForegroundColor Cyan
Write-Host "1. Com Traefik (recomendado se Traefik estiver rodando)" -ForegroundColor White
Write-Host "2. Com Nginx direto (portas 8080/8443)" -ForegroundColor White
Write-Host "3. Sair" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Deploy com Traefik..." -ForegroundColor Yellow
        $composeFile = "docker-compose.yml"
        $accessUrl = "https://app-dev.smartzap.net"
    }
    "2" {
        Write-Host "Deploy com Nginx direto..." -ForegroundColor Yellow
        $composeFile = "docker-compose-nginx.yml"
        $accessUrl = "https://localhost:8443"
    }
    "3" {
        Write-Host "Saindo..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Opção inválida. Usando Traefik por padrão." -ForegroundColor Yellow
        $composeFile = "docker-compose.yml"
        $accessUrl = "https://app-dev.smartzap.net"
    }
}

# Deploy do stack
Write-Host "Fazendo deploy do stack usando $composeFile..." -ForegroundColor Yellow
docker stack deploy -c $composeFile smartzap

# Aguarda um pouco para os serviços iniciarem
Write-Host "Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verifica o status dos serviços
Write-Host "Status dos serviços:" -ForegroundColor Green
docker service ls | Select-String "smartzap"

Write-Host "=== Deploy concluído! ===" -ForegroundColor Green
Write-Host "Acesse: $accessUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos úteis:" -ForegroundColor Yellow
Write-Host "  Ver logs: docker service logs smartzap_frontend" -ForegroundColor White
Write-Host "  Ver logs backend: docker service logs smartzap_backend" -ForegroundColor White
Write-Host "  Escalar: docker service scale smartzap_frontend=2" -ForegroundColor White
Write-Host "  Parar: docker stack rm smartzap" -ForegroundColor White
