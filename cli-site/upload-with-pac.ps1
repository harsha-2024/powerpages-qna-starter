
param(
  [Parameter(Mandatory=$true)][string]$EnvironmentUrl,
  [Parameter(Mandatory=$true)][string]$WebsiteId
)
$ErrorActionPreference = 'Stop'
$websiteYml = Join-Path $PSScriptRoot 'websites/Website.yml'
(Get-Content $websiteYml) -replace 'WEBSITEID-REPLACE-ME', $WebsiteId | Set-Content $websiteYml
pac org select --environment $EnvironmentUrl | Out-Null
pac pages upload --path $PSScriptRoot
