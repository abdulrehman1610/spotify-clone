# Robust, fast album cover extractor for spotdl / ID3 MP3s

$songsDir = Join-Path $PSScriptRoot "Songs"
$dirs = Get-ChildItem -Path $songsDir -Directory

$extracted = 0
$skipped = 0

foreach ($dir in $dirs) {
    $outPath = Join-Path $dir.FullName "img.jpg"
    
    # Check if img.jpg already exists
    if (Test-Path $outPath) {
        $existingSize = (Get-Item $outPath).Length
        # If it's already a valid image (> 1KB), we can skip unless it was from our slow test
        if ($existingSize -gt 1000 -and $dir.Name -ne "After Dark x Sweater Weather") {
            Write-Host "  -> [Exists] '$($dir.Name)'" -ForegroundColor DarkGray
            $skipped++
            continue
        }
    }

    $audioFile = Get-ChildItem -Path $dir.FullName -File | Where-Object { $_.Extension -match '^\.(mp3|wav|ogg|m4a|flac)$' } | Select-Object -First 1
    if (-not $audioFile) { continue }

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

            $foundCover = $false

            # 1. Search for APIC frame
            for ($i = 0; $i -lt $tagBytes.Length - 10; $i++) {
                if ($tagBytes[$i] -eq 0x41 -and $tagBytes[$i+1] -eq 0x50 -and $tagBytes[$i+2] -eq 0x49 -and $tagBytes[$i+3] -eq 0x43) {
                    $frameSize = if ($version -eq 4) {
                        (($tagBytes[$i+4] -band 0x7F) -shl 21) -bor (($tagBytes[$i+5] -band 0x7F) -shl 14) -bor (($tagBytes[$i+6] -band 0x7F) -shl 7) -bor ($tagBytes[$i+7] -band 0x7F)
                    } else {
                        ([int]$tagBytes[$i+4] -shl 24) -bor ([int]$tagBytes[$i+5] -shl 16) -bor ([int]$tagBytes[$i+6] -shl 8) -bor [int]$tagBytes[$i+7]
                    }

                    $frameStart = $i + 10
                    $frameEnd = [Math]::Min($frameStart + $frameSize, $tagBytes.Length)

                    # Look for JPEG
                    for ($k = $frameStart; $k -lt $frameEnd - 4; $k++) {
                        if ($tagBytes[$k] -eq 0xFF -and $tagBytes[$k+1] -eq 0xD8 -and $tagBytes[$k+2] -eq 0xFF) {
                            $imgLen = $frameEnd - $k
                            $imgBytes = New-Object byte[] $imgLen
                            [System.Array]::Copy($tagBytes, $k, $imgBytes, 0, $imgLen)
                            [System.IO.File]::WriteAllBytes($outPath, $imgBytes)
                            Write-Host "  -> [Extracted JPEG] '$($dir.Name)' ($([Math]::Round($imgLen/1024)) KB)" -ForegroundColor Green
                            $foundCover = $true
                            $extracted++
                            break
                        }
                        # Look for PNG
                        if ($tagBytes[$k] -eq 0x89 -and $tagBytes[$k+1] -eq 0x50 -and $tagBytes[$k+2] -eq 0x4E -and $tagBytes[$k+3] -eq 0x47) {
                            $imgLen = $frameEnd - $k
                            $imgBytes = New-Object byte[] $imgLen
                            [System.Array]::Copy($tagBytes, $k, $imgBytes, 0, $imgLen)
                            [System.IO.File]::WriteAllBytes($outPath, $imgBytes)
                            Write-Host "  -> [Extracted PNG] '$($dir.Name)' ($([Math]::Round($imgLen/1024)) KB)" -ForegroundColor Green
                            $foundCover = $true
                            $extracted++
                            break
                        }
                    }
                    if ($foundCover) { break }
                }
            }

            # 2. Fallback: Search anywhere inside tagBytes for JPEG
            if (-not $foundCover) {
                for ($k = 0; $k -lt $tagBytes.Length - 4; $k++) {
                    if ($tagBytes[$k] -eq 0xFF -and $tagBytes[$k+1] -eq 0xD8 -and $tagBytes[$k+2] -eq 0xFF) {
                        # Find 0xFF 0xD9
                        for ($end = $tagBytes.Length - 2; $end -gt $k; $end--) {
                            if ($tagBytes[$end] -eq 0xFF -and $tagBytes[$end+1] -eq 0xD9) {
                                $imgLen = $end - $k + 2
                                $imgBytes = New-Object byte[] $imgLen
                                [System.Array]::Copy($tagBytes, $k, $imgBytes, 0, $imgLen)
                                [System.IO.File]::WriteAllBytes($outPath, $imgBytes)
                                Write-Host "  -> [Fallback JPEG] '$($dir.Name)' ($([Math]::Round($imgLen/1024)) KB)" -ForegroundColor Green
                                $foundCover = $true
                                $extracted++
                                break
                            }
                        }
                        if ($foundCover) { break }
                    }
                }
            }

            if (-not $foundCover) {
                Write-Host "  -> [No Cover Found] '$($dir.Name)'" -ForegroundColor Yellow
            }
        } else {
            $fs.Close()
            Write-Host "  -> [No ID3 Tag] '$($dir.Name)'" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  -> Error on '$($dir.Name)': $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cover extraction complete! Extracted: $extracted, Existing: $skipped" -ForegroundColor Cyan
Write-Host ""
Write-Host "Refreshing songs.json with extracted cover images..." -ForegroundColor Cyan
& (Join-Path $PSScriptRoot "update_songs.ps1")
