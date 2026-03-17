# Node Flags

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.NodeFlags?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.NodeFlags/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.NodeFlags?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.NodeFlags)
[![GitHub license](https://img.shields.io/github/license/Terningen/RequiredNodeFlag?color=8AB803)](https://github.com/Terningen/RequiredNodeFlag/blob/main/LICENSE)

Node Flags is an Umbraco package that adds reusable visual flags to content nodes in the backoffice Content tree.

It helps editors quickly mark, prioritize, and identify important content without changing the content itself.

With this package you can:

- Create reusable flag definitions in the Settings section
- Choose an icon, icon color, background color, and priority for each flag
- Toggle one or more flags from the document action menu
- Make important, review-required, featured, or campaign content easier to spot

<!--
Including screenshots is a really good idea! 

If you put images into /docs/screenshots, then you would reference them in this readme as, for example:

<img alt="..." src="https://github.com/Terningen/Node Flags/blob/develop/docs/screenshots/screenshot.png">

And don't forget to add the screenshot files to umbraco-marketplace.json too!
-->

## Installation

Add the package to an existing Umbraco website (v17+) from nuget:

`dotnet add package Umbraco.Community.NodeFlags`

After installing the package:

- Go to the **Settings** section in Umbraco
- Open the **Node Flags** dashboard
- Create the flags you want editors to use
- Open a content node and use the **Flags** action to toggle flags on that item

## Contributing

Contributions to this package are most welcome. Please read the [Contributing Guidelines](CONTRIBUTING.md) before opening a pull request.

## Acknowledgments

Built for Umbraco editors who need a simple visual way to highlight and organize content in the backoffice tree.

This package was inspired by the work from [CodeCabin](https://codecab.in/), whose packages and ideas helped motivate this project.