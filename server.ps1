<#
  TFTEsport - local dev server (Windows PowerShell 5.1, nothing to install).

  - Serves the site with clean URLs (/news -> news.html, /cups/vorlage -> cups/vorlage.html) and /assets/*.
  - /api/streams   all live "Teamfight Tactics" streams on Twitch, most viewers first (cached).
  - /api/users     Twitch profile data (avatar) for up to 100 logins: /api/users?login=a,b,c

  Twitch credentials are read from twitch.config.json (see twitch.config.example.json)
  or from the env vars TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET. They never leave this process.
  Without credentials the API answers { source: "demo" } and the page shows demo streams.

  Start:  "Seite starten.cmd"   (or: powershell -ExecutionPolicy Bypass -File server.ps1 -Open)
#>
param(
  [int]$Port = 8080,
  [switch]$Open
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = Join-Path $PSScriptRoot 'public'   # only this folder is served
$GameName = 'Teamfight Tactics'
$CacheSeconds = 90     # how long one Twitch snapshot is reused
$MaxPages = 20         # 100 streams per page -> up to 2,000 streams

# ---------- Config ----------
$cfg = $null
$cfgPath = Join-Path $PSScriptRoot 'twitch.config.json'
if (Test-Path $cfgPath) { $cfg = Get-Content $cfgPath -Raw -Encoding UTF8 | ConvertFrom-Json }
$ClientId = if ($env:TWITCH_CLIENT_ID) { $env:TWITCH_CLIENT_ID } elseif ($cfg) { $cfg.clientId } else { '' }
$ClientSecret = if ($env:TWITCH_CLIENT_SECRET) { $env:TWITCH_CLIENT_SECRET } elseif ($cfg) { $cfg.clientSecret } else { '' }
$HasCreds = [bool]($ClientId -and $ClientSecret)

$state = @{
  token = $null; tokenExp = [datetime]::MinValue
  gameId = $null
  streamsJson = $null; streamsAt = [datetime]::MinValue
  users = @{}
}

# ---------- Twitch ----------
function Read-Json($resp) {
  # Decode as UTF-8 explicitly; PS 5.1 otherwise guesses ISO-8859-1 and breaks non-latin titles.
  [Text.Encoding]::UTF8.GetString($resp.RawContentStream.ToArray()) | ConvertFrom-Json
}

function Get-Token {
  if ($state.token -and (Get-Date) -lt $state.tokenExp) { return $state.token }
  $body = @{ client_id = $ClientId; client_secret = $ClientSecret; grant_type = 'client_credentials' }
  $r = Read-Json (Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'https://id.twitch.tv/oauth2/token' -Body $body)
  $state.token = $r.access_token
  $state.tokenExp = (Get-Date).AddSeconds([int]$r.expires_in - 300)
  return $state.token
}

function Invoke-Helix([string]$PathAndQuery) {
  $uri = "https://api.twitch.tv/helix/$PathAndQuery"
  for ($attempt = 0; $attempt -lt 2; $attempt++) {
    $headers = @{ 'Client-Id' = $ClientId; 'Authorization' = "Bearer $(Get-Token)" }
    try {
      return Read-Json (Invoke-WebRequest -UseBasicParsing -Uri $uri -Headers $headers)
    } catch {
      $code = 0
      if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
      if ($code -eq 401 -and $attempt -eq 0) { $state.token = $null; continue }   # token revoked -> fetch a new one once
      throw
    }
  }
}

function Get-GameId {
  if (-not $state.gameId) {
    $r = Invoke-Helix "games?name=$([uri]::EscapeDataString($GameName))"
    if (-not $r.data) { throw "Twitch category '$GameName' not found" }
    $state.gameId = $r.data[0].id
    Write-Host "Twitch category '$GameName' = $($state.gameId)"
  }
  return $state.gameId
}

function Get-StreamsJson {
  $age = ((Get-Date) - $state.streamsAt).TotalSeconds
  if ($state.streamsJson -and $age -lt $CacheSeconds) { return $state.streamsJson }
  if (-not $HasCreds) {
    return (ConvertTo-Json -Compress -InputObject @{ source = 'demo'; reason = 'no-credentials' })
  }

  $gameId = Get-GameId
  $list = New-Object System.Collections.Generic.List[object]
  $total = 0
  $cursor = $null
  for ($i = 0; $i -lt $MaxPages; $i++) {
    $q = "streams?game_id=$gameId&type=live&first=100"
    if ($cursor) { $q += "&after=$cursor" }
    $r = Invoke-Helix $q
    foreach ($s in $r.data) {
      $started = if ($s.started_at -is [datetime]) { $s.started_at.ToUniversalTime().ToString('o') } else { [string]$s.started_at }
      $total += [int]$s.viewer_count
      $list.Add([ordered]@{
        login     = $s.user_login
        name      = $s.user_name
        title     = $s.title
        viewers   = [int]$s.viewer_count
        lang      = $s.language
        startedAt = $started
        thumb     = ($s.thumbnail_url -replace '\{width\}x\{height\}', '440x248')
        tags      = @($s.tags | Where-Object { $_ } | Select-Object -First 3)
        mature    = [bool]$s.is_mature
      })
    }
    $cursor = $r.pagination.cursor
    if (-not $cursor -or @($r.data).Count -lt 100) { $cursor = $null; break }
  }

  $payload = [ordered]@{
    source       = 'twitch'
    game         = $GameName
    updatedAt    = (Get-Date).ToUniversalTime().ToString('o')
    totalStreams = $list.Count
    totalViewers = $total
    capped       = [bool]$cursor
    streams      = $list.ToArray()
  }
  $state.streamsJson = ConvertTo-Json -Compress -Depth 5 -InputObject $payload
  $state.streamsAt = Get-Date
  Write-Host ("[{0:HH:mm:ss}] Twitch refresh: {1} streams, {2} viewers" -f (Get-Date), $list.Count, $total)
  return $state.streamsJson
}

function Get-UsersJson([string]$loginsParam) {
  $logins = @($loginsParam -split ',' | ForEach-Object { $_.Trim().ToLower() } |
    Where-Object { $_ -match '^[a-z0-9_]{1,25}$' } | Select-Object -Unique -First 100)
  if (-not $HasCreds) { return (ConvertTo-Json -Compress -InputObject @{ source = 'demo'; users = @{} }) }

  $missing = @($logins | Where-Object { -not $state.users.ContainsKey($_) })
  if ($missing.Count) {
    $r = Invoke-Helix ('users?' + (($missing | ForEach-Object { "login=$_" }) -join '&'))
    foreach ($u in $r.data) {
      $state.users[$u.login] = [ordered]@{ name = $u.display_name; avatar = $u.profile_image_url }
    }
    foreach ($l in $missing) { if (-not $state.users.ContainsKey($l)) { $state.users[$l] = $null } }
  }
  $out = [ordered]@{}
  foreach ($l in $logins) { if ($state.users[$l]) { $out[$l] = $state.users[$l] } }
  return (ConvertTo-Json -Compress -Depth 4 -InputObject @{ source = 'twitch'; users = $out })
}

# ---------- HTTP ----------
$Mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'
  '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.ico' = 'image/x-icon'
  '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'; '.xml' = 'application/xml; charset=utf-8'
}

function Send($ctx, [int]$status, [string]$type, [byte[]]$bytes) {
  $res = $ctx.Response
  $res.StatusCode = $status
  $res.ContentType = $type
  $res.AddHeader('Cache-Control', 'no-store')
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.OutputStream.Close()
}
function Send-Text($ctx, [int]$status, [string]$type, [string]$text) {
  Send $ctx $status $type ([Text.Encoding]::UTF8.GetBytes($text))
}

function Handle($ctx) {
  $path = [uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)

  if ($path -eq '/api/streams') {
    try {
      Send-Text $ctx 200 $Mime['.json'] (Get-StreamsJson)
    } catch {
      Write-Warning "Twitch error: $($_.Exception.Message)"
      if ($state.streamsJson) { Send-Text $ctx 200 $Mime['.json'] $state.streamsJson }   # serve last good snapshot
      else { Send-Text $ctx 502 $Mime['.json'] (ConvertTo-Json -Compress -InputObject @{ error = 'twitch-unavailable'; message = $_.Exception.Message }) }
    }
    return
  }
  if ($path -eq '/api/users') {
    try { Send-Text $ctx 200 $Mime['.json'] (Get-UsersJson ([string]$ctx.Request.QueryString['login'])) }
    catch { Send-Text $ctx 502 $Mime['.json'] '{"error":"twitch-unavailable"}' }
    return
  }

  # Clean URLs like Vercel (cleanUrls + trailingSlash false): /news.html -> /news, /news/ -> /news, /index -> /
  $query = $ctx.Request.Url.Query
  $clean = $null
  if ($path -match '^/(.+)\.html$') { $clean = '/' + ($Matches[1] -replace '(^|/)index$', '') }
  elseif ($path.Length -gt 1 -and $path.EndsWith('/')) { $clean = $path.TrimEnd('/') }
  if ($null -ne $clean) {
    if ($clean -eq '') { $clean = '/' }
    $ctx.Response.RedirectLocation = $clean + $query
    Send-Text $ctx 301 'text/plain; charset=utf-8' 'Moved'
    return
  }

  # Static files: pages (/news -> news.html, /cups/vorlage -> cups/vorlage.html), /assets/*, robots.txt, sitemap.xml.
  # Only files inside public/ are reachable; config and scripts live outside it.
  $file = $null
  if ($path -eq '/') { $file = 'index.html' }
  elseif ($path -match '^(/[a-z0-9-]+){1,2}$') { $file = $path.TrimStart('/') + '.html' }
  elseif ($path -match '^/assets/[A-Za-z0-9_./-]+$' -and $path -notmatch '\.\.') { $file = $path.TrimStart('/') }
  elseif ($path -in '/robots.txt', '/sitemap.xml') { $file = $path.TrimStart('/') }
  if ($file) {
    $full = [IO.Path]::GetFullPath((Join-Path $Root ($file -replace '/', '\')))
    if ($full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $full -PathType Leaf)) {
      $ext = [IO.Path]::GetExtension($full).ToLower()
      $type = if ($Mime[$ext]) { $Mime[$ext] } else { 'application/octet-stream' }
      Send $ctx 200 $type ([IO.File]::ReadAllBytes($full))
      return
    }
  }
  $notFound = Join-Path $Root '404.html'
  if (Test-Path $notFound) { Send $ctx 404 $Mime['.html'] ([IO.File]::ReadAllBytes($notFound)) }
  else { Send-Text $ctx 404 'text/plain; charset=utf-8' 'Not found' }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host ''
Write-Host "  TFTEsport dev server running on http://localhost:$Port/" -ForegroundColor Yellow
if ($HasCreds) { Write-Host '  Twitch: connected (credentials found)' -ForegroundColor Green }
else { Write-Host '  Twitch: NOT connected -> demo data. Add twitch.config.json, see README.' -ForegroundColor DarkYellow }
Write-Host '  Stop with Ctrl+C'
Write-Host ''
if ($Open) { Start-Process "http://localhost:$Port/" }

try {
  while ($listener.IsListening) {
    $task = $listener.GetContextAsync()
    while (-not $task.AsyncWaitHandle.WaitOne(250)) { }   # short waits keep Ctrl+C responsive
    $ctx = $task.GetAwaiter().GetResult()
    try { Handle $ctx }
    catch {
      Write-Warning $_.Exception.Message
      try { Send-Text $ctx 500 'text/plain; charset=utf-8' 'Server error' } catch { }
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
