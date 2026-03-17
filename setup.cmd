@ECHO OFF
:: This file can now be deleted!
:: It was used when setting up the package solution (using https://github.com/LottePitcher/opinionated-package-starter)

:: set up git
git init
git branch -M main
git remote add origin https://github.com/Terningen/Node Flags.git

:: ensure latest Umbraco templates used
dotnet new install Umbraco.Templates --force

:: use the umbraco-extension dotnet template to add the package project
cd src
dotnet new umbraco-extension -n "NodeFlags" --site-domain "https://localhost:44306" --include-example

:: replace package .csproj with the one from the template so has the extra information needed for publishing to nuget
cd NodeFlags
del NodeFlags.csproj
ren NodeFlags_nuget.csproj NodeFlags.csproj

:: add project to solution
cd..
dotnet sln add "NodeFlags"

:: add reference to project from test site
dotnet add "NodeFlags.TestSite/NodeFlags.TestSite.csproj" reference "NodeFlags/NodeFlags.csproj"
