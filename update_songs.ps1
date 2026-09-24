<#
.SYNOPSIS
  Spotify Clone - Music Indexer
  Automatically scans the Songs/ directory, parses all audio files and album covers,
  and updates songs.json so the web app immediately discovers new music.
#>

$SongsDir = Join-Path $PSScriptRoot "Songs"
$OutputFile = Join-Path $PSScriptRoot "songs.json"

if (-not (Test-Path $SongsDir)) {
    Write-Host "Error: Songs directory not found at $SongsDir" -ForegroundColor Red
    exit 1
}

Write-Host "Scanning $SongsDir for music tracks..." -ForegroundColor Cyan

# Read existing metadata if available to preserve custom lyrics/tags
$existingDict = @{}
if (Test-Path $OutputFile) {
    try {
        $raw = Get-Content $OutputFile -Raw -Encoding UTF8 | ConvertFrom-Json
        foreach ($item in $raw) {
            if ($item.id) { $existingDict[$item.id] = $item }
            elseif ($item.title) { $existingDict[$item.title.ToLower()] = $item }
        }
    } catch {
        # ignore parse error
    }
}

$colors = @("#7c2d12", "#1e1b4b", "#831843", "#14532d", "#1c1917", "#3b0764", "#0369a1", "#047857", "#b45309", "#4338ca")
$colorIdx = 0

$songList = [System.Collections.Generic.List[PSObject]]::new()
$subdirs = Get-ChildItem -Path $SongsDir -Directory | Sort-Object Name

foreach ($dir in $subdirs) {
    $audioFile = Get-ChildItem -Path $dir.FullName -File | Where-Object { $_.Extension -match '^\.(mp3|wav|ogg|m4a|flac|aac)$' } | Select-Object -First 1
    if (-not $audioFile) {
        Write-Host "Skipping '$($dir.Name)': no audio file found" -ForegroundColor Yellow
        continue
    }

    $imageFile = Get-ChildItem -Path $dir.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } | Select-Object -First 1
    $coverRel = if ($imageFile) { "Songs/$($dir.Name)/$($imageFile.Name)" } else { "Svg/logo.svg" }
    $audioRel = "Songs/$($dir.Name)/$($audioFile.Name)"

    $id = ($dir.Name.ToLower() -replace '[^a-z0-9]+', '-') -replace '^-|-$', ''
    $existing = if ($existingDict.ContainsKey($id)) { $existingDict[$id] } else { $existingDict[$dir.Name.ToLower()] }

    # Parse title and artist from folder or file name
    $title = $dir.Name
    $artist = "Unknown Artist"

    $cleanBase = ($audioFile.BaseName -replace 'utomp3\.com\s*-\s*', '' -replace '\s*\(Lyrics\)\s*', '').Trim()

    if ($dir.Name -eq "Unstoppable - Acoustic") {
        $artist = "Honeyfox, lost., Pop Mage"
        $title = "Unstoppable (Acoustic)"
    } elseif ($cleanBase -match 'Darci\s+On My Own') {
        $artist = "Darci"
        $title = "On My Own"
    } elseif ($cleanBase -match '^(?<artist>[^-]+)\s*-\s*(?<title>.+)$') {
        $artist = $matches['artist'].Trim()
        $title = $dir.Name
    } elseif ($dir.Name -match '^(?<artist>[^-]+)\s*-\s*(?<title>.+)$') {
        $artist = $matches['artist'].Trim()
        $title = $matches['title'].Trim()
    } elseif ($existing -and $existing.artist) {
        $artist = $existing.artist
        $title = if ($existing.title) { $existing.title } else { $dir.Name }
    }

    $vibe = if ($existing -and $existing.vibe) { $existing.vibe } else { "Chill Vibe" }
    $tags = if ($existing -and $existing.tags) { $existing.tags } else { @("music", "chill", "local") }
    $lyrics = if ($existing -and $existing.lyrics) { $existing.lyrics } else { @(@{ time = 0; text = "♪ Music Playing ♪" }) }
    $color = if ($existing -and $existing.color) { $existing.color } else { $colors[$colorIdx % $colors.Count] }
    $colorIdx++

    $songObj = [PSCustomObject]@{
        id = $id
        title = $title
        artist = $artist
        album = if ($existing -and $existing.album) { $existing.album } else { "$title Single" }
        src = $audioRel
        cover = $coverRel
        duration = if ($existing -and $existing.duration) { $existing.duration } else { "3:30" }
        vibe = $vibe
        tags = $tags
        color = $color
        lyrics = $lyrics
    }

    $songList.Add($songObj)
    Write-Host "  -> Added: '$title' by '$artist'" -ForegroundColor Green
}

$json = $songList | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($OutputFile, $json, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated '$OutputFile' with $($songList.Count) songs!" -ForegroundColor Green
