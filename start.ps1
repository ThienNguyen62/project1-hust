param(
    [switch]$Seed,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$backend = Join-Path $PSScriptRoot 'backend'
$frontend = Join-Path $PSScriptRoot 'frontend'
$vite = Join-Path $frontend 'node_modules/vite/bin/vite.js'
$node = (Get-Command node.exe).Source
$backendProcess = $null
$frontendProcess = $null
$appUrl = 'http://localhost:5173'
$logs = Join-Path ([IO.Path]::GetTempPath()) ('project1-' + [guid]::NewGuid().ToString('N'))

function Wait-ForHttp($Url, $Process) {
    $deadline = [DateTime]::UtcNow.AddSeconds(20)
    while ([DateTime]::UtcNow -lt $deadline) {
        if ($Process -and $Process.HasExited) { throw "Server exited before responding at $Url. Logs: $logs" }
        try {
            return Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        } catch {
            if ($_.Exception.Response) { throw }
            Start-Sleep -Milliseconds 250
        }
    }
    throw "Timed out waiting for $Url."
}

function Test-LocalPort([int]$Port) {
    try {
        $null = Invoke-WebRequest "http://localhost:$Port/" -UseBasicParsing -TimeoutSec 2
        return $true
    } catch {
        if ($_.Exception.Response) { return $true }
    }
    $client = [Net.Sockets.TcpClient]::new()
    try {
        $client.Connect('localhost', $Port)
        return $true
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

try {
    if (-not (Test-Path -LiteralPath $vite) -or
        -not (Test-Path -LiteralPath (Join-Path $backend 'node_modules/express/package.json'))) {
        throw 'Run npm.cmd ci in backend and frontend before first startup.'
    }

    Push-Location -LiteralPath $backend
    try {
        $apiPort = & $node -e "require('dotenv').config({quiet:true}); console.log(Number(process.env.PORT || 3000))"
        if ($LASTEXITCODE -ne 0 -or $apiPort -notmatch '^\d+$' -or
            [int]$apiPort -lt 1 -or [int]$apiPort -gt 65535) {
            throw 'Check PORT in backend/.env.'
        }
        npm.cmd run db:check
        if ($LASTEXITCODE -ne 0) { throw 'MySQL check failed. Check the service and backend/.env.' }
    } finally {
        Pop-Location
    }

    $apiUrl = "http://localhost:$apiPort/api"
    $backendRunning = Test-LocalPort $apiPort
    $frontendRunning = Test-LocalPort 5174
    if (-not ($backendRunning -and $frontendRunning)) {
        New-Item -ItemType Directory -Path $logs | Out-Null
    }
    if (-not $backendRunning) {
        $backendProcess = Start-Process -FilePath $node -ArgumentList 'src/server.js' `
            -WorkingDirectory $backend -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput (Join-Path $logs 'backend.log') `
            -RedirectStandardError (Join-Path $logs 'backend-error.log')
    }
    $health = Wait-ForHttp "$apiUrl/health" $backendProcess
    if (($health.Content | ConvertFrom-Json).message -ne 'School Management API is running') {
        throw "Port $apiPort is in use by another server."
    }
    try {
        $years = Invoke-WebRequest -Uri "$apiUrl/academic-years" -Headers @{ Origin = $appUrl } `
            -UseBasicParsing -TimeoutSec 5
    } catch {
        throw 'Academic-year API failed. Check that schema.sql and the GhiChu migration have been applied.'
    }
    if ($years.Headers['Access-Control-Allow-Origin'] -ne $appUrl) {
        throw "Set CLIENT_ORIGIN=$appUrl in backend/.env."
    }
    if ($Seed) {
        Push-Location -LiteralPath $backend
        try {
            npm.cmd run db:seed
            if ($LASTEXITCODE -ne 0) { throw 'Seed failed.' }
        } finally {
            Pop-Location
        }
    }

    if (-not $frontendRunning) {
        $previousApiUrl = $env:VITE_API_URL
        try {
            $env:VITE_API_URL = "http://localhost:$apiPort"
            $frontendProcess = Start-Process -FilePath $node `
                -ArgumentList 'node_modules/vite/bin/vite.js --port 5173 --strictPort' `
                -WorkingDirectory $frontend -WindowStyle Hidden -PassThru `
                -RedirectStandardOutput (Join-Path $logs 'frontend.log') `
                -RedirectStandardError (Join-Path $logs 'frontend-error.log')
        } finally {
            $env:VITE_API_URL = $previousApiUrl
        }
    }
    $page = Wait-ForHttp "$appUrl/src/components/AcademicYearsPage.jsx" $frontendProcess
    if ($page.Content -notmatch 'saveAcademicYear') { throw 'Port 5173 is in use by another server.' }

    Write-Host "Project I: $appUrl"
    if (-not $NoBrowser) { Start-Process $appUrl }
    $started = @($backendProcess, $frontendProcess) | Where-Object { $_ }
    if (-not $started) { return }
    Write-Host "Logs: $logs"
    Write-Host 'Press Ctrl+C to stop the servers started by this script.'

    while (-not ($started | Where-Object { $_.HasExited })) {
        Start-Sleep -Seconds 1
    }
    throw "A server stopped unexpectedly. Check logs in $logs."
} finally {
    foreach ($process in @($frontendProcess, $backendProcess)) {
        if ($process -and -not $process.HasExited) {
            Stop-Process -InputObject $process -ErrorAction SilentlyContinue
        }
    }
}
