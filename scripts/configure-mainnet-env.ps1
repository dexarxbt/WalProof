$ErrorActionPreference = "Stop"

function Read-PlainOrBlank($Prompt) {
  $value = Read-Host $Prompt
  return $value.Trim()
}

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

Write-Host ""
Write-Host "WalProof mainnet configuration" -ForegroundColor Cyan
Write-Host "Values are written only to .env.local. TATUM_API_KEY is server-side only." -ForegroundColor DarkGray
Write-Host ""

$tatumApiKey = Read-SecretOrBlank "TATUM_API_KEY"
$packageId = Read-PlainOrBlank "NEXT_PUBLIC_WALPROOF_PACKAGE_ID after Sui publish (blank if not published yet)"
$walrusPublisher = Read-PlainOrBlank "WALRUS_PUBLISHER_URL (or blank if using relay)"
$walrusRelay = Read-PlainOrBlank "WALRUS_UPLOAD_RELAY_URL (or blank if using publisher)"
$walrusAggregator = Read-PlainOrBlank "WALRUS_AGGREGATOR_URL"
$supabaseUrl = Read-PlainOrBlank "NEXT_PUBLIC_SUPABASE_URL (optional)"
$supabaseAnon = Read-PlainOrBlank "NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)"
$supabaseService = Read-SecretOrBlank "SUPABASE_SERVICE_ROLE_KEY (optional)"

$content = @"
NEXT_PUBLIC_APP_NAME=WalProof

NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_TATUM_SUI_RPC_MAINNET=https://sui-mainnet.gateway.tatum.io
NEXT_PUBLIC_TATUM_SUI_RPC_TESTNET=https://sui-testnet.gateway.tatum.io
NEXT_PUBLIC_TATUM_SUI_RPC_DEVNET=https://sui-devnet.gateway.tatum.io

TATUM_API_KEY=$tatumApiKey

NEXT_PUBLIC_WALPROOF_PACKAGE_ID=$packageId
NEXT_PUBLIC_WALPROOF_REGISTRY_MODULE=registry

NEXT_PUBLIC_WALRUS_NETWORK=mainnet
WALRUS_PUBLISHER_URL=$walrusPublisher
WALRUS_AGGREGATOR_URL=$walrusAggregator
WALRUS_UPLOAD_RELAY_URL=$walrusRelay

NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnon
SUPABASE_SERVICE_ROLE_KEY=$supabaseService
"@

Set-Content -LiteralPath $envPath -Value $content -Encoding UTF8

Write-Host ""
Write-Host ".env.local saved at $envPath" -ForegroundColor Green
Write-Host "Restart the WalProof server after changing env values." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close"
