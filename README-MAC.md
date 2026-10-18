# Run on another MacBook

## 1. Extract the website

Copy ganesh-invitation-mac.zip to the MacBook and double-click it in Finder. This creates the ganesh-invitation-mac folder.

## 2. Check Python 3

Open Terminal and run:

```sh
python3 --version
```

If Python is unavailable, install Python 3 for macOS from https://www.python.org/downloads/macos/ and reopen Terminal. If macOS requests Command Line Tools, you can install them or install Python directly from python.org.

## 3. Start the website

If the ZIP was extracted in Downloads:

```sh
cd ~/Downloads/ganesh-invitation-mac
bash Start-Invitation.command
```

If extracted elsewhere, type `cd ` in Terminal, drag the extracted folder into Terminal, and press Return. Then run `bash Start-Invitation.command`.

Open http://localhost:8080 in Safari or Chrome. Keep the Terminal window open while viewing. Stop the server with Control+C.

You can also double-click Start-Invitation.command in Finder. If the Mac blocks the downloaded script or its execute permission was not preserved, use the Terminal command above.

## If port 8080 is already in use

From the extracted folder, run:

```sh
python3 -m http.server 8081 --bind 127.0.0.1
```

Then open http://localhost:8081.

## View from a phone on the same Wi-Fi (optional)

From the extracted folder, stop the existing server with Control+C, then run:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Find the MacBook's Wi-Fi IP address in System Settings > Wi-Fi > Details > TCP/IP. On the phone, open http://MACBOOK_IP:8080. Allow incoming connections if macOS asks. Keep both devices on the same local network.

## Included

All code, fonts, pictures, video, audio, and map QR are bundled. No npm install or build is required. The map destination requires internet access. Safari or Chrome may require a first tap to start audible music. Loading the site on a phone over local HTTP can limit clipboard copying; the Google Maps button remains available.
