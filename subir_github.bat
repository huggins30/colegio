# Script de subida a GitHub
# Configura primero tu repositorio:
#   git remote add origin https://github.com/USUARIO/REPOSITORIO.git
# o para SSH:
#   git remote add origin git@github.com:USUARIO/REPOSITORIO.git

@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Script de Subida a GitHub
echo ========================================
echo.

REM Verificar si hay un remoto configurado
git remote -v | findstr "origin" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: No se encontro un repositorio remoto configurado.
    echo.
    echo Configura el remoto manualmente con:
    echo   git remote add origin https://github.com/USUARIO/REPOSITORIO.git
    echo.
    set /p repoUrl="Ingrese la URL del repositorio de GitHub (ej: https://github.com/usuario/repo.git): "
    if not "!repoUrl!"=="" (
        git remote add origin !repoUrl!
        echo Remoto configurado correctamente.
    ) else (
        echo No se configuro el remoto. Cancelando...
        pause
        exit /b 1
    )
)

echo Agregando archivos...
git add .

echo.
echo Estado actual:
git status

echo.
set /p commitMsg="Ingrese el mensaje del commit: "
if "!commitMsg!"=="" set commitMsg=Actualizacion de archivos

echo.
echo Realizando commit...
git commit -m "!commitMsg!"

echo.
echo Subiendo a GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Archivos subidos correctamente!
    echo ========================================
) else (
    echo.
    echo ERROR: No se pudieron subir los archivos.
    echo Verifique sus credenciales y la configuracion del repositorio.
)

pause