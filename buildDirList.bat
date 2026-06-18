@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -Command "$extensions = '*.txt','*.jpg','*.png','*.bmp','*.mp3','*.ogg','*.mpa','*.x','*.obj'; $roots = 'learning','examples','src/sharedMedia'; $repo = (Get-Location).Path; $files = foreach ($root in $roots) { foreach ($extension in $extensions) { Get-ChildItem -Path $root -Filter $extension -Recurse -File -ErrorAction SilentlyContinue } }; $paths = $files | Sort-Object FullName -Unique | ForEach-Object { $_.FullName.Substring($repo.Length + 1).Replace('\','/') }; $content = 'var dirlist = `' + [Environment]::NewLine + ($paths -join [Environment]::NewLine) + [Environment]::NewLine + '`;'; Set-Content -Path 'src/js/dirlist.js' -Value $content -Encoding ASCII"
