# Homepage Plus
Some description...

## Project setup 
Inside ./Homepage-Plus/client/testproject
build production file.
```
npm install
npm run build
```
#### Auto server
Auto server sets up a service on your machine to run the server.js on boot.
You may decide to not use this, but makes the QoL much better.

Inside Auto-Server and Auto-Server-Uninstall change file location to '...\\server\\server.js'
- Temp, should generalize later.

To create an auto server
```
node Auto-Server.js
```

To uninstall
```
node Auto-Server-Uninstall.js
```

## Browser homepage
Browers can change home page url and can use extensions to change new tab URL.
the URL for the page is .http://localhost:5000 and where necesary add this in.

Firefox-> Settings, home -> custom url, {paste}
Use extension, new tab override, set link to homepage. (linked together).

chrome -> settings, home button {paste}
On startup -> open a specific page {paste}
Extension -> Custom tab URL, follow demo process,
	- then click puzzle, triple icon and options on ext, {paste URL}

## License
 This project is licensed under the GNU General Public License v3.0. See the [License](LICENSE.md) file for details.
