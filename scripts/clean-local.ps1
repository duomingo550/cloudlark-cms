param(
  [switch]$IncludeDependencies
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$targets = @(
  '.env',
  '.next',
  'cloudlark.db',
  'cloudlark.db-shm',
  'cloudlark.db-wal',
  'ci-build.db',
  'media',
  'tsconfig.tsbuildinfo'
)

if ($IncludeDependencies) {
  $targets += 'node_modules'
}

foreach ($name in $targets) {
  $target = Join-Path $root $name
  if (-not (Test-Path -LiteralPath $target)) {
    continue
  }
  $resolved = (Resolve-Path -LiteralPath $target).Path
  if (-not $resolved.StartsWith($root + [IO.Path]::DirectorySeparatorChar)) {
    throw "Refusing to delete outside repository: $resolved"
  }
  Remove-Item -LiteralPath $resolved -Recurse -Force
  Write-Host "Removed $resolved"
}

Write-Host 'Local secrets and generated files are clean.'
