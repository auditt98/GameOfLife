const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(__dirname + '/public'))


// app.get('', (req, res) => res.send('hello'))
app.get('*', (req, res) => res.sendFile(__dirname + '/index.html'))
app.listen(3000 || process.env.PORT, () => console.log(`Example app listening on port port!`))