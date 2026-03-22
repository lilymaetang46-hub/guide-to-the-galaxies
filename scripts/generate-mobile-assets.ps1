$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $root "public"
$androidResDir = Join-Path $root "android\app\src\main\res"

function New-Canvas($size, $backgroundColor) {
    $size = [int]$size
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear($backgroundColor)

    return @{
        Bitmap = $bitmap
        Graphics = $graphics
    }
}

function Save-Png($bitmap, $path) {
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Draw-AppIcon($size, $path) {
    $size = [int]$size
    $canvas = New-Canvas $size ([System.Drawing.Color]::FromArgb(255, 10, 16, 38))
    $bitmap = $canvas.Bitmap
    $graphics = $canvas.Graphics

    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        ([System.Drawing.Color]::FromArgb(255, 14, 23, 54)),
        ([System.Drawing.Color]::FromArgb(255, 7, 11, 28)),
        45
    )
    $graphics.FillRectangle($backgroundBrush, $rect)

    $orbitPen = New-Object System.Drawing.Pen(([System.Drawing.Color]::FromArgb(180, 117, 181, 255)), [Math]::Max(4, $size * 0.03))
    $orbitPen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Center
    $graphics.DrawEllipse($orbitPen, $size * 0.14, $size * 0.18, $size * 0.72, $size * 0.54)
    $graphics.DrawEllipse($orbitPen, $size * 0.25, $size * 0.12, $size * 0.5, $size * 0.72)

    $planetBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 246, 201, 108))
    $graphics.FillEllipse($planetBrush, $size * 0.62, $size * 0.22, $size * 0.12, $size * 0.12)
    $graphics.FillEllipse($planetBrush, $size * 0.23, $size * 0.58, $size * 0.09, $size * 0.09)

    $starPoints = @(
        [System.Drawing.PointF]::new([float]($size * 0.5), [float]($size * 0.2)),
        [System.Drawing.PointF]::new([float]($size * 0.56), [float]($size * 0.4)),
        [System.Drawing.PointF]::new([float]($size * 0.76), [float]($size * 0.4)),
        [System.Drawing.PointF]::new([float]($size * 0.6), [float]($size * 0.52)),
        [System.Drawing.PointF]::new([float]($size * 0.66), [float]($size * 0.74)),
        [System.Drawing.PointF]::new([float]($size * 0.5), [float]($size * 0.6)),
        [System.Drawing.PointF]::new([float]($size * 0.34), [float]($size * 0.74)),
        [System.Drawing.PointF]::new([float]($size * 0.4), [float]($size * 0.52)),
        [System.Drawing.PointF]::new([float]($size * 0.24), [float]($size * 0.4)),
        [System.Drawing.PointF]::new([float]($size * 0.44), [float]($size * 0.4))
    )
    $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 236, 181))
    $graphics.FillPolygon($starBrush, $starPoints)

    Save-Png $bitmap $path

    $starBrush.Dispose()
    $planetBrush.Dispose()
    $orbitPen.Dispose()
    $backgroundBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Draw-Splash($width, $height, $path) {
    $width = [int]$width
    $height = [int]$height
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $rect = New-Object System.Drawing.RectangleF(0, 0, $width, $height)
    $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        ([System.Drawing.Color]::FromArgb(255, 7, 11, 28)),
        ([System.Drawing.Color]::FromArgb(255, 18, 29, 64)),
        60
    )
    $graphics.FillRectangle($backgroundBrush, $rect)

    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 126, 193, 255))
    $graphics.FillEllipse($glowBrush, $width * 0.1, $height * 0.12, $width * 0.34, $height * 0.34)
    $graphics.FillEllipse($glowBrush, $width * 0.64, $height * 0.54, $width * 0.22, $height * 0.22)

    $orbitPen = New-Object System.Drawing.Pen(([System.Drawing.Color]::FromArgb(165, 124, 184, 255)), [Math]::Max(8, $width * 0.008))
    $graphics.DrawEllipse($orbitPen, $width * 0.29, $height * 0.18, $width * 0.42, $height * 0.34)
    $graphics.DrawEllipse($orbitPen, $width * 0.38, $height * 0.12, $width * 0.24, $height * 0.46)

    $starPoints = @(
        [System.Drawing.PointF]::new([float]($width * 0.5), [float]($height * 0.23)),
        [System.Drawing.PointF]::new([float]($width * 0.53), [float]($height * 0.33)),
        [System.Drawing.PointF]::new([float]($width * 0.62), [float]($height * 0.33)),
        [System.Drawing.PointF]::new([float]($width * 0.55), [float]($height * 0.39)),
        [System.Drawing.PointF]::new([float]($width * 0.58), [float]($height * 0.49)),
        [System.Drawing.PointF]::new([float]($width * 0.5), [float]($height * 0.43)),
        [System.Drawing.PointF]::new([float]($width * 0.42), [float]($height * 0.49)),
        [System.Drawing.PointF]::new([float]($width * 0.45), [float]($height * 0.39)),
        [System.Drawing.PointF]::new([float]($width * 0.38), [float]($height * 0.33)),
        [System.Drawing.PointF]::new([float]($width * 0.47), [float]($height * 0.33))
    )
    $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 236, 181))
    $graphics.FillPolygon($starBrush, $starPoints)

    $titleFont = New-Object System.Drawing.Font("Trebuchet MS", [Math]::Round($width * 0.04), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $subtitleFont = New-Object System.Drawing.Font("Trebuchet MS", [Math]::Round($width * 0.017), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 240, 244, 255))
    $subtitleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 189, 205, 239))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center

    $graphics.DrawString("Guide to the Galaxies", $titleFont, $titleBrush, $width / 2, $height * 0.62, $format)
    $graphics.DrawString("Tracker and outsider support in one shared orbit", $subtitleFont, $subtitleBrush, $width / 2, $height * 0.72, $format)

    Save-Png $bitmap $path

    $format.Dispose()
    $subtitleBrush.Dispose()
    $titleBrush.Dispose()
    $subtitleFont.Dispose()
    $titleFont.Dispose()
    $starBrush.Dispose()
    $orbitPen.Dispose()
    $glowBrush.Dispose()
    $backgroundBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

Draw-AppIcon 180 (Join-Path $publicDir "apple-touch-icon.png")
Draw-AppIcon 192 (Join-Path $publicDir "icon-192.png")
Draw-AppIcon 512 (Join-Path $publicDir "icon-512.png")
Draw-AppIcon 1024 (Join-Path $publicDir "mobile-app-icon.png")
Draw-Splash 2732 2732 (Join-Path $publicDir "mobile-splash.png")

$launcherSizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $launcherSizes.Keys) {
    $size = $launcherSizes[$folder]
    $targetDir = Join-Path $androidResDir $folder
    Draw-AppIcon $size (Join-Path $targetDir "ic_launcher.png")
    Draw-AppIcon $size (Join-Path $targetDir "ic_launcher_round.png")
    Draw-AppIcon ([int][Math]::Round($size * 2.25)) (Join-Path $targetDir "ic_launcher_foreground.png")
}

$splashSizes = @{
    "drawable" = @(2732, 2732)
    "drawable-port-mdpi" = @(320, 480)
    "drawable-port-hdpi" = @(480, 800)
    "drawable-port-xhdpi" = @(720, 1280)
    "drawable-port-xxhdpi" = @(960, 1600)
    "drawable-port-xxxhdpi" = @(1280, 1920)
    "drawable-land-mdpi" = @(480, 320)
    "drawable-land-hdpi" = @(800, 480)
    "drawable-land-xhdpi" = @(1280, 720)
    "drawable-land-xxhdpi" = @(1600, 960)
    "drawable-land-xxxhdpi" = @(1920, 1280)
}

foreach ($folder in $splashSizes.Keys) {
    $dimensions = $splashSizes[$folder]
    $targetDir = Join-Path $androidResDir $folder
    Draw-Splash $dimensions[0] $dimensions[1] (Join-Path $targetDir "splash.png")
}
