# Script para verificar se o Traefik está rodando
Write-Host "=== Verificando Traefik ===" -ForegroundColor Green

# Verifica se o Traefik está rodando como serviço
$traefikService = docker service ls 2>&1 | Select-String "traefik"
if ($traefikService) {
    Write-Host "✅ Traefik encontrado como serviço Docker Swarm" -ForegroundColor Green
    Write-Host "Recomendado: Use a opção 1 (Com Traefik) no deploy" -ForegroundColor Cyan
} else {
    Write-Host "❌ Traefik não encontrado como serviço Docker Swarm" -ForegroundColor Red
}

# Verifica se há containers Traefik rodando
$traefikContainer = docker ps 2>&1 | Select-String "traefik"
if ($traefikContainer) {
    Write-Host "✅ Container Traefik encontrado" -ForegroundColor Green
    Write-Host "Recomendado: Use a opção 1 (Com Traefik) no deploy" -ForegroundColor Cyan
} else {
    Write-Host "❌ Container Traefik não encontrado" -ForegroundColor Red
}

# Verifica se a porta 80 está em uso
$port80 = netstat -an 2>&1 | Select-String ":80 "
if ($port80) {
    Write-Host "⚠️  Porta 80 está em uso:" -ForegroundColor Yellow
    Write-Host $port80 -ForegroundColor White
    Write-Host "Recomendado: Use a opção 2 (Com Nginx direto) no deploy" -ForegroundColor Cyan
} else {
    Write-Host "✅ Porta 80 está livre" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Resumo ===" -ForegroundColor Green
if ($traefikService -or $traefikContainer) {
    Write-Host "Use: .\deploy.ps1 e escolha opção 1" -ForegroundColor Cyan
} else {
    Write-Host "Use: .\deploy.ps1 e escolha opção 2" -ForegroundColor Cyan
}
