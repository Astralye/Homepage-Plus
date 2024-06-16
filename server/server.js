const express = require('express');
const path = require('path');
const app = express()
const port = 5000;

var htmlPath = path.join(__dirname , "..", "client","testproject","dist");

console.log(htmlPath);

app.use(express.static(htmlPath));

app.use((req, res) => {
    res.status(404);
    res.sendFile(`<h1>Error: 404</h1>`);
}) 

// Local host 5000 is the WEB SERVER.
// This uses the build file of the webpage.
// Thus, this is more final build and production ready

// For development of page, need to use localhost 3000,
// Development server for html, js and css updates.

// NOTE, THEY ARE NOT THE SAME TYPE OF SERVERS

// This is able to send the static html and is able to load the page 
app.get("/", (req, res) => {
    res.sendFile(path.join(htmlPath,"index.html"));
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})