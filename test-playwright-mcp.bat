@echo off
echo ========================================
echo TESTE DE VERIFICACAO - PLAYWRIGHT MCP
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    exit /b 1
)
echo OK - Node.js instalado
echo.

echo [2/5] Verificando NPM...
npm --version
if %errorlevel% neq 0 (
    echo ERRO: NPM nao encontrado!
    exit /b 1
)
echo OK - NPM instalado
echo.

echo [3/5] Verificando NPX...
where npx
if %errorlevel% neq 0 (
    echo ERRO: NPX nao encontrado!
    exit /b 1
)
echo OK - NPX disponivel
echo.

echo [4/5] Verificando Playwright MCP...
npx @playwright/mcp --version
if %errorlevel% neq 0 (
    echo ERRO: Playwright MCP nao encontrado!
    exit /b 1
)
echo OK - Playwright MCP instalado

echo.

echo [5/5] Verificando navegadores Playwright...
echo Chromium:
if exist "%LOCALAPPDATA%\ms-playwright\chromium-1194" (
    echo   OK - Chromium instalado
) else (
    echo   AVISO - Chromium nao encontrado
)

echo Firefox:
if exist "%LOCALAPPDATA%\ms-playwright\firefox-1495" (
    echo   OK - Firefox instalado
) else (
    echo   AVISO - Firefox nao encontrado
)

echo Webkit:
if exist "%LOCALAPPDATA%\ms-playwright\webkit-2215" (
    echo   OK - Webkit instalado
) else (
    echo   AVISO - Webkit nao encontrado
)
echo.

echo [6/6] Verificando configuracao do Claude Desktop...
if exist "%APPDATA%\Claude\claude_desktop_config.json" (
    echo OK - Arquivo de configuracao encontrado
    findstr /C:"playwright" "%APPDATA%\Claude\claude_desktop_config.json" >nul
    if %errorlevel% equ 0 (
        echo OK - Playwright configurado no Claude Desktop
    ) else (
        echo ERRO - Playwright NAO configurado no Claude Desktop
        exit /b 1
    )
) else (
    echo ERRO - Arquivo de configuracao NAO encontrado!
    exit /b 1
)
echo.

echo ========================================
echo TODOS OS TESTES PASSARAM COM SUCESSO!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo 1. Feche o Claude Desktop completamente
echo 2. Reabra o Claude Desktop
echo 3. O Playwright MCP estara disponivel
echo.
