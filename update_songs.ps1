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

    # Auto-extract embedded cover if missing from MP3
    if (-not $imageFile -and $audioFile.Extension -eq '.mp3') {
        try {
            $fs = [System.IO.File]::OpenRead($audioFile.FullName)
            $header = New-Object byte[] 10
            $read = $fs.Read($header, 0, 10)
            if ($read -ge 10 -and $header[0] -eq 0x49 -and $header[1] -eq 0x44 -and $header[2] -eq 0x33) {
                $version = $header[3]
                $tagSize = (($header[6] -band 0x7F) -shl 21) -bor (($header[7] -band 0x7F) -shl 14) -bor (($header[8] -band 0x7F) -shl 7) -bor ($header[9] -band 0x7F)
                $tagBytes = New-Object byte[] $tagSize
                $fs.Read($tagBytes, 0, $tagSize) | Out-Null
                $fs.Close()

                for ($i = 0; $i -lt $tagBytes.Length - 10; $i++) {
                    if ($tagBytes[$i] -eq 0x41 -and $tagBytes[$i+1] -eq 0x50 -and $tagBytes[$i+2] -eq 0x49 -and $tagBytes[$i+3] -eq 0x43) {
                        $frameSize = if ($version -eq 4) {
                            (($tagBytes[$i+4] -band 0x7F) -shl 21) -bor (($tagBytes[$i+5] -band 0x7F) -shl 14) -bor (($tagBytes[$i+6] -band 0x7F) -shl 7) -bor ($tagBytes[$i+7] -band 0x7F)
                        } else {
                            ([int]$tagBytes[$i+4] -shl 24) -bor ([int]$tagBytes[$i+5] -shl 16) -bor ([int]$tagBytes[$i+6] -shl 8) -bor [int]$tagBytes[$i+7]
                        }
                        $frameStart = $i + 10
                        $frameEnd = [Math]::Min($frameStart + $frameSize, $tagBytes.Length)
                        for ($k = $frameStart; $k -lt $frameEnd - 4; $k++) {
                            if (($tagBytes[$k] -eq 0xFF -and $tagBytes[$k+1] -eq 0xD8 -and $tagBytes[$k+2] -eq 0xFF) -or
                                ($tagBytes[$k] -eq 0x89 -and $tagBytes[$k+1] -eq 0x50 -and $tagBytes[$k+2] -eq 0x4E -and $tagBytes[$k+3] -eq 0x47)) {
                                $imgLen = $frameEnd - $k
                                $imgBytes = New-Object byte[] $imgLen
                                [System.Array]::Copy($tagBytes, $k, $imgBytes, 0, $imgLen)
                                $extractedPath = Join-Path $dir.FullName "img.jpg"
                                [System.IO.File]::WriteAllBytes($extractedPath, $imgBytes)
                                $imageFile = Get-Item $extractedPath
                                Write-Host "  -> Auto-extracted album cover for '$($dir.Name)'" -ForegroundColor Cyan
                                break
                            }
                        }
                        break
                    }
                }
            } else {
                $fs.Close()
            }
        } catch {}
    }

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
