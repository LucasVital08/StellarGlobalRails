param(
  [string]$ApiUrl = $env:VITE_KIVO_API_URL,
  [string]$EnvFile = "apps/kivo/.env",
  [string]$FlyApp = "stellarglobalrails"
)

$ErrorActionPreference = "Continue"

function Write-Check {
  param(
    [string]$Name,
    [bool]$Ok,
    [string]$Detail = ""
  )

  $status = if ($Ok) { "OK" } else { "FAIL" }
  if ($Detail) {
    Write-Output "$status`t$Name`t$Detail"
  } else {
    Write-Output "$status`t$Name"
  }
}

function Get-EnvValue {
  param([string]$Key)

  if (!(Test-Path $EnvFile)) {
    return ""
  }

  $line = Get-Content $EnvFile | Where-Object { $_ -like "$Key=*" } | Select-Object -First 1
  if (!$line) {
    return ""
  }

  return ($line -split "=", 2)[1].Trim()
}

if (!$ApiUrl) {
  $ApiUrl = "https://stellarglobalrails.fly.dev"
}

$ApiUrl = $ApiUrl.TrimEnd("/")

Write-Output "Kivo delivery preflight"
Write-Output "API: $ApiUrl"
Write-Output ""

foreach ($key in @("DATABASE_URL", "KIVO_SECRET_ENCRYPTION_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "X402_PLATFORM_KEY", "ETHERFUSE_API_KEY", "ETHERFUSE_WEBHOOK_SECRET")) {
  $value = Get-EnvValue $key
  Write-Check "env:$key" ([bool]$value) $(if ($value) { "set" } else { "missing" })
}

try {
  $docker = docker ps --format "{{.Names}}" 2>$null
  Write-Check "docker" ($LASTEXITCODE -eq 0) $(if ($LASTEXITCODE -eq 0) { "reachable" } else { "not reachable" })
} catch {
  Write-Check "docker" $false "not reachable"
}

foreach ($port in @(54322, 6379)) {
  $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet
  Write-Check "local-port:$port" $connection
}

foreach ($path in @("/v1/health", "/v1/etherfuse/status", "/v1/x402/challenge?resource=%2Fapi%2Fx402%2Fdata")) {
  try {
    $response = Invoke-WebRequest -Uri "$ApiUrl$path" -TimeoutSec 20 -UseBasicParsing
    Write-Check "api:$path" ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) "HTTP $($response.StatusCode)"
  } catch {
    $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
    Write-Check "api:$path" $false "HTTP $status"
  }
}

try {
  $flyStatus = flyctl status -a $FlyApp 2>&1
  Write-Check "fly:$FlyApp" ($LASTEXITCODE -eq 0) $(if ($LASTEXITCODE -eq 0) { "status reachable" } else { ($flyStatus | Select-Object -First 1) })
} catch {
  Write-Check "fly:$FlyApp" $false "flyctl unavailable"
}

$platformKey = Get-EnvValue "X402_PLATFORM_KEY"
if ($platformKey -and $platformKey.StartsWith("G") -and $platformKey.Length -gt 50) {
  try {
    $account = Invoke-WebRequest -Uri "https://horizon-testnet.stellar.org/accounts/$platformKey" -TimeoutSec 20 -UseBasicParsing
    Write-Check "stellar:X402_PLATFORM_KEY" ($account.StatusCode -eq 200) "funded on testnet"
  } catch {
    $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
    Write-Check "stellar:X402_PLATFORM_KEY" $false "HTTP $status"
  }
} else {
  Write-Check "stellar:X402_PLATFORM_KEY" $false "missing or placeholder"
}
