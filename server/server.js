require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
// const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/login", (req, res) => {
    let code = req.body.code


    let spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
        console.log(res)
        }).catch(err => {
            console.log("Broken"+err)
        })
})

app.post("/refresh", (req,res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        clientId: '394758341b2147028b2ec9f669d38ba0',
        clientSecret: 'a6c64a39f405434c8b3f4a219a048a94',
        redirectUri: "http://localhost:3000",
        refreshToken,
    })
    
    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        }).catch(err => {console.log(err)})
})

// app.get("/search",(req,res) => {
//     console.log("Searched")
// })

app.listen(3001)