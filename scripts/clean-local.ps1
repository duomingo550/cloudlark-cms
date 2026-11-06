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
  'verify-final.db',
  'final-test.db',
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

foreach ($pattern in @(
  '_verify-*.ts',
  'verify-tmp.db*',
  'tmp-check.db*',
  '*.db-journal'
)) {
  Get-ChildItem -LiteralPath $root -Filter $pattern -Force -ErrorAction SilentlyContinue |
    ForEach-Object {
      Remove-Item -LiteralPath $_.FullName -Recurse -Force
      Write-Host "Removed $($_.FullName)"
    }
}

foreach ($name in @('.dsh', '.penguinharness')) {
  $target = Join-Path $root $name
  if (Test-Path -LiteralPath $target) {
    Remove-Item -LiteralPath $target -Recurse -Force
    Write-Host "Removed $target"
  }
}

Write-Host 'Local secrets and generated files are clean.'
