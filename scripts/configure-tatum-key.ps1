$ErrorActionPreference = "Stop"

function Read-SecretOrBlank($Prompt) {
  $secure = Read-Host $Prompt -AsSecureString
  if ($secure.Length -eq 0) {
    return ""
  }
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot ".env.local"

if (!(Test-Path -LiteralPath $envPath)) {
  Copy-Item -LiteralPath (Join-Path $projectRoot ".env.example") -Destination $envPath
}

Write-Host ""
Write-Host "WalProof Tatum configuration" -ForegroundColor Cyan
Write-Host "Paste your Tatum API key. It will be saved only in .env.local." -ForegroundColor DarkGray
Write-Host ""

$key = Read-SecretOrBlank "TATUM_API_KEY"
if (!$key) {
  Write-Host "No key entered. Nothing changed." -ForegroundColor Yellow
  Read-Host "Press Enter to close"
  exit 0
}

$content = Get-Content -LiteralPath $envPath -Raw
if ($content -match "(?m)^TATUM_API_KEY=") {
  $content = $content -replace "(?m)^TATUM_API_KEY=.*$", "TATUM_API_KEY=$key"
}
else {
  $content = $content.TrimEnd() + "`r`nTATUM_API_KEY=$key`r`n"
}

Set-Content -LiteralPath $envPath -Value $content -Encoding UTF8
Write-Host ""
Write-Host "TATUM_API_KEY saved to .env.local." -ForegroundColor Green
Write-Host "Restart WalProof after this prompt closes." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close"
