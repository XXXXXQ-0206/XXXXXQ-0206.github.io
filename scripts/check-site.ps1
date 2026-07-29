param(
  [string]$RepositoryRoot = (Join-Path $PSScriptRoot '..')
)

Set-StrictMode -Version Latest
$failures = [System.Collections.Generic.List[string]]::new()
$requiredFiles = @(
  'index.html', 'styles.css', 'script.js', 'README.md', 'LICENSE', '.gitignore',
  'scripts/check-site.ps1', '.github/workflows/pages.yml', '.github/workflows/quality.yml'
)

foreach ($relativePath in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepositoryRoot $relativePath))) {
    $failures.Add("Missing required file: $relativePath")
  }
}

$htmlPath = Join-Path $RepositoryRoot 'index.html'
$cssPath = Join-Path $RepositoryRoot 'styles.css'
$scriptPath = Join-Path $RepositoryRoot 'script.js'
if (Test-Path -LiteralPath $htmlPath) {
  $html = Get-Content -Raw -LiteralPath $htmlPath
  foreach ($sectionId in @('main-content', 'research', 'projects', 'education', 'contact')) {
    if ($html -notmatch ('id="' + $sectionId + '"')) { $failures.Add("Missing section id: $sectionId") }
  }
  $translationNodes = [regex]::Matches($html, 'data-i18n\s+data-en="([^"]+)"\s+data-zh="([^"]+)"')
  if ($translationNodes.Count -lt 28) { $failures.Add("Expected at least 28 bilingual content nodes, found $($translationNodes.Count)") }
  foreach ($node in $translationNodes) {
    if ([string]::IsNullOrWhiteSpace($node.Groups[1].Value) -or [string]::IsNullOrWhiteSpace($node.Groups[2].Value)) { $failures.Add('A bilingual content node has an empty translation.') }
  }
  foreach ($projectName in @('EduMind', 'Gokumoku', 'mips32-five-stage-cpu', 'zynq-ethernet-switch', 'CquAutoLogin')) {
    if ($html -notmatch [regex]::Escape($projectName)) { $failures.Add("Missing project: $projectName") }
  }
  if ($html -notmatch '38992488@qq\.com') { $failures.Add('Approved public email is missing from index.html.') }
}
if (Test-Path -LiteralPath $cssPath) {
  $css = Get-Content -Raw -LiteralPath $cssPath
  foreach ($term in @('prefers-color-scheme: dark', 'background-size: 28px 28px', '--display:', '--body:', '--mono:', 'prefers-reduced-motion')) {
    if ($css -notmatch [regex]::Escape($term)) { $failures.Add("Missing visual-system contract: $term") }
  }
}
if (Test-Path -LiteralPath $scriptPath) {
  $script = Get-Content -Raw -LiteralPath $scriptPath
  foreach ($term in @('localStorage', 'aria-pressed', 'document.documentElement.lang', 'dataset[language]')) {
    if ($script -notmatch [regex]::Escape($term)) { $failures.Add("Missing language-switch behavior: $term") }
  }
}

$filesToScan = Get-ChildItem -LiteralPath $RepositoryRoot -Recurse -File | Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' -and $_.Name -ne 'check-site.ps1' }
foreach ($file in $filesToScan) {
  $content = Get-Content -Raw -LiteralPath $file.FullName
  if ($content -match '(?im)-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----') { $failures.Add("Private-key marker found: $($file.FullName)") }
  if ($content -match '(?i)(C:\\Users\\|C:/Users/)') { $failures.Add("Local Windows path found: $($file.FullName)") }
  if ($content -match '(?im)\b(TODO|TBD|FIXME)\b') { $failures.Add("Unfinished marker found: $($file.FullName)") }
  foreach ($email in ([regex]::Matches($content, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}') | ForEach-Object Value | Sort-Object -Unique)) {
    if ($email -ne '38992488@qq.com') { $failures.Add("Unapproved email found in $($file.FullName): $email") }
  }
}

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { "AUDIT: $_" }
  exit 1
}
Write-Output 'Site audit passed.'
exit 0
