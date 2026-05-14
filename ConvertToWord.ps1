# Convert Markdown to Word Document
# This script converts PROJECT_PRESENTATION.md to a Word document

Write-Host "Converting PROJECT_PRESENTATION.md to Word format..." -ForegroundColor Cyan

# Check if Word is available
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false

    # Open the markdown file
    $mdPath = Join-Path $PSScriptRoot "PROJECT_PRESENTATION.md"
    $doc = $word.Documents.Open($mdPath)

    # Save as Word document
    $docxPath = Join-Path $PSScriptRoot "PROJECT_PRESENTATION.docx"
    $doc.SaveAs([ref]$docxPath, [ref]16) # 16 = wdFormatDocumentDefault (.docx)

    $doc.Close()
    $word.Quit()

    Write-Host "✓ Successfully created: PROJECT_PRESENTATION.docx" -ForegroundColor Green
    Write-Host "  Location: $docxPath" -ForegroundColor Yellow

} catch {
    Write-Host "✗ Error: Could not convert using Word COM object" -ForegroundColor Red
    Write-Host "  Please open PROJECT_PRESENTATION.md in Word manually" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual Steps:" -ForegroundColor Cyan
    Write-Host "1. Open Microsoft Word" -ForegroundColor White
    Write-Host "2. File → Open" -ForegroundColor White
    Write-Host "3. Select PROJECT_PRESENTATION.md" -ForegroundColor White
    Write-Host "4. File → Save As → Choose .docx format" -ForegroundColor White
}

# Cleanup
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
