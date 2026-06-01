param(
    [Parameter(Mandatory=$true)]
    [string]$Profile,
    [Parameter(Mandatory=$true)]
    [string]$Platform
)

$envContent = Get-Content -Path ".env" -ErrorAction SilentlyContinue
foreach ($line in $envContent) {
    if ($line -match '^EXPO_TOKEN=(.*)') {
        $env:EXPO_TOKEN = $matches[1]
        break
    }
}

if (-not $env:EXPO_TOKEN) {
    Write-Error "EXPO_TOKEN not found in .env file"
    exit 1
}

Write-Host "Building with profile: $Profile, platform: $Platform"
eas build --profile $Profile --platform $Platform --non-interactive
