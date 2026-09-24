# Organizes loose MP3 files in Songs/ into their respective folders named with the Song Name only.

$songsDir = Join-Path $PSScriptRoot "Songs"

$files = Get-ChildItem -Path $songsDir -File | Where-Object { $_.Extension -match '^\.(mp3|wav|ogg|m4a|flac)$' }

foreach ($file in $files) {
    $base = $file.BaseName
    
    # Extract Song Name from "Artist - Song Name"
    if ($base -match '^[^-]+-\s*(?<title>.+)$') {
        $rawTitle = $matches['title'].Trim()
        
        # Clean extra qualifiers like - From 'Movie' or - slowed
        $folderName = $rawTitle
        if ($rawTitle -match '^All The Stars') {
            $folderName = "All The Stars"
        } elseif ($rawTitle -match '^BIBA SADA') {
            $folderName = "BIBA SADA"
        } elseif ($rawTitle -match '^After Dark x Sweater Weather') {
            $folderName = "After Dark x Sweater Weather"
        }
    } else {
        $folderName = $base
    }

    $destFolder = Join-Path $songsDir $folderName
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder | Out-Null
        Write-Host "Created folder: '$folderName'" -ForegroundColor Cyan
    }

    $destPath = Join-Path $destFolder $file.Name
    Copy-Item -Path $file.FullName -Destination $destPath -Force
    Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
    Write-Host "Moved '$($file.Name)' -> '$folderName/'" -ForegroundColor Green
}

Write-Host "All songs successfully organized into song-named folders!" -ForegroundColor Green
