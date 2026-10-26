# Google Drive PDF Image Exporter

A browser-console JavaScript utility that attempts to export rendered PDF page images from Google Drive's preview into a PDF file using jsPDF.

## Requirements

- Desktop browser with developer tools
- Google Drive PDF preview
- Access to the document and permission to save or reproduce its content
- Internet access to load jsPDF from CDN

## Usage

1. Open an authorized PDF in Google Drive.
2. Open browser developer tools (`F12` or `Ctrl + Shift + J` in Chrome).
3. Select the Console tab.
4. Paste `drive-pdf-export.js` and run it.
5. Check the console output and verify the downloaded PDF.

## Limitations

- Exports rendered images, not the original PDF file.
- May export only pages currently loaded in the viewer.
- Image quality and completeness depend on the viewer.
- Google Drive changes, browser security policies, and CDN availability may break the script.
- This is not a guarantee of complete PDF recovery.

## Disclaimer

Use only for documents you own or are authorized to download or reproduce. Respect document permissions and copyright.

## Dependency

[jsPDF](https://github.com/parallax/jsPDF)
