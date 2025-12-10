# Cleanup duplicate frontend folder
$duplicatePath = "frontend\frontend"

if (Test-Path $duplicatePath) {
    Write-Host "Removing duplicate folder: $duplicatePath"
    Remove-Item -Path $duplicatePath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Duplicate folder removed successfully!"
} else {
    Write-Host "No duplicate folder found at: $duplicatePath"
}

Write-Host "`nVerifying structure..."
Get-ChildItem "frontend" -Directory | Select-Object Name
