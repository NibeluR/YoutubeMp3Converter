//request package
const express = require("express");
const fetch = require("node-fetch");
const favicon = require('express-favicon');
require("dotenv").config();

//express server
const app = express();

//server port
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//parse HTML data for POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.use(favicon(__dirname + '/public/favicon.png'));


//Youtube RapidAPI mp3 converter
app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID;
    if(
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ){
        return res.render("index", {success : false, message : "Please enter valid video ID"});
    }else{
        const YoutubeAPI = await fetch(`https://youtube-mp3-download1.p.rapidapi.com/dl?id=${videoId}`, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY, 
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponse = await YoutubeAPI.json();

        if(fetchResponse.status === "ok")
        return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link});
        else
        return res.render("index", {success: false, message : fetchResponse.msg})
    }
})
//server start
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})
