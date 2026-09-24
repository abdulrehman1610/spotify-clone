param([int]$Port = 3002)

$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Error starting server on port $Port : $_" -ForegroundColor Red
    Write-Host "Port $Port might already be in use by another program." -ForegroundColor Yellow
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   Spotify Clone Local Web Server Running!               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  -> Local URL:   http://localhost:$Port" -ForegroundColor Yellow
Write-Host "  -> Ngrok Tunnel: Forwarding to port $Port" -ForegroundColor Cyan
Write-Host "  -> Serving:     $PSScriptRoot" -ForegroundColor Gray
Write-Host "  -> Status:      Ready for connections (Press Ctrl+C to stop)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
    ".ogg"  = "audio/ogg"
    ".m4a"  = "audio/mp4"
    ".flac" = "audio/flac"
}

$root = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }

        $filePath = Join-Path $root ($urlPath -replace '/', [System.IO.Path]::DirectorySeparatorChar)
        $fullPath = [System.IO.Path]::GetFullPath($filePath)

        # Security check: must be inside root directory
        if (-not $fullPath.StartsWith([System.IO.Path]::GetFullPath($root))) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $fileInfo = Get-Item $fullPath
            $fileLength = $fileInfo.Length

            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Accept-Ranges", "bytes")

            $rangeHeader = $request.Headers["Range"]
            if ($rangeHeader -and $rangeHeader -match "bytes=(\d+)-(\d*)") {
                $start = [int64]$matches[1]
                $end = if ($matches[2]) { [int64]$matches[2] } else { $fileLength - 1 }
                if ($end -ge $fileLength) { $end = $fileLength - 1 }
                $chunkSize = $end - $start + 1

                $response.StatusCode = 206
                $response.Headers.Add("Content-Range", "bytes $start-$end/$fileLength")
                $response.ContentLength64 = $chunkSize

                $fs = [System.IO.File]::OpenRead($fullPath)
                $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                $buffer = New-Object byte[] 65536
                $bytesRemaining = $chunkSize
                while ($bytesRemaining -gt 0) {
                    $toRead = [Math]::Min($bytesRemaining, $buffer.Length)
                    $bytesRead = $fs.Read($buffer, 0, $toRead)
                    if ($bytesRead -le 0) { break }
                    $response.OutputStream.Write($buffer, 0, $bytesRead)
                    $bytesRemaining -= $bytesRead
                }
                $fs.Close()
            } else {
                $response.StatusCode = 200
                $response.ContentLength64 = $fileLength
                $fs = [System.IO.File]::OpenRead($fullPath)
                $fs.CopyTo($response.OutputStream)
                $fs.Close()
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # ignore connection resets
    }
}
