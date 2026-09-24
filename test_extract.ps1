$mp3Path = "D:\Experiments with AI\spotify-clone\Songs\After Hours\The Weeknd - After Hours.mp3"
$bytes = [System.IO.File]::ReadAllBytes($mp3Path)

Write-Host "Total MP3 size: $($bytes.Length)"

# Check ID3
if ($bytes[0] -eq 0x49 -and $bytes[1] -eq 0x44 -and $bytes[2] -eq 0x33) {
    $tagSize = (($bytes[6] -band 0x7F) -shl 21) -bor (($bytes[7] -band 0x7F) -shl 14) -bor (($bytes[8] -band 0x7F) -shl 7) -bor ($bytes[9] -band 0x7F)
    Write-Host "ID3v2 Tag Size: $tagSize"
}

# Search for JPEG magic 0xFF, 0xD8, 0xFF inside tag or first 5MB
$foundJpg = $false
for ($i = 0; $i -lt [Math]::Min($bytes.Length - 4, 3000000); $i++) {
    if ($bytes[$i] -eq 0xFF -and $bytes[$i+1] -eq 0xD8 -and $bytes[$i+2] -eq 0xFF) {
        Write-Host "Found JPEG start at offset $i"
        # Find JPEG end: 0xFF, 0xD9
        for ($j = $i + 10; $j -lt [Math]::Min($bytes.Length - 2, $i + 5000000); $j++) {
            if ($bytes[$j] -eq 0xFF -and $bytes[$j+1] -eq 0xD9) {
                $imgLength = $j - $i + 2
                Write-Host "Found JPEG end at offset $j (Length: $imgLength bytes)"
                $imgBytes = New-Object byte[] $imgLength
                [System.Array]::Copy($bytes, $i, $imgBytes, 0, $imgLength)
                $outPath = "D:\Experiments with AI\spotify-clone\Songs\After Hours\img.jpg"
                [System.IO.File]::WriteAllBytes($outPath, $imgBytes)
                Write-Host "Wrote extracted cover to $outPath ($imgLength bytes)" -ForegroundColor Green
                $foundJpg = $true
                break
            }
        }
        if ($foundJpg) { break }
    }
}

if (-not $foundJpg) {
    Write-Host "JPEG not found, checking PNG..."
}
