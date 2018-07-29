require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var keys = require("./keys");
var twitkeys = keys.twitter;
var spotifykeys = keys.spotify;
var request = require("request");
var fs = require('fs');
var inquirer = require("inquirer");

// Store all of the arguments in an array
var nodeArgv = process.argv[2];
var tweetsArray = [];
var movie = [];

var params = {
    screen_name: 'nodejs',
    count: 20
};
// on screen menu
inquirer.prompt([
    {
        type: "list",
        message: "What is your command, Master?",
        choices: ["List my Recent Tweets", "Spotify A Song", "Get movie details", "Do what-it says"],
        name: "commands"
    }
])
    .then(function (inquirerResponse) {

        switch (inquirerResponse.commands) {

            case "List my Recent Tweets":
            
                getRecentTweets(nodeArgv);
                break;

            case "Spotify A Song":

                getMediaDetails(nodeArgv);
                break;

            case "Get movie details":

                getMedia(nodeArgv);
                break;

            case "Do what it says":

                doit()
                break;

            default:

                console.log("I don't know what you want from me.");
        }
    });

function getRecentTweets(nodeArgv) {
    
    if (nodeArgv === "my-tweets") {
       
        var client = new Twitter({
            consumer_key: twitkeys.TWITTER_CONSUMER_KEY,
            consumer_secret: twitkeys.TWITTER_CONSUMER_SECRET,
            access_token_key: twitkeys.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: twitkeys.TWITTER_ACCESS_TOKEN_SECRET
        });

        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            //console.log(error);
            if (!error) {
                tweetsArray = tweets;

                for (i = 0; i < tweetsArray.length; i++) {
                    console.log("Created at: " + tweetsArray[i].created_at);
                    console.log("Text: " + tweetsArray[i].text);
                    console.log('--------------------------------------');
                }
            } else {
                console.log(error);
            };
        });
    }
    log();
}

function getMediaDetails(song) {
    
    var spotify = new Spotify(keys.spotify);
    
    if (!song) {
        song = 'The Sign';
    }

    spotify.search({ type: 'track', query: "\"" + song + "\"" }, function (err, data) {
        if (!err) {
            var songData = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songData[i] != undefined) {
                    console.log("------Artists-----");
                    console.log('');
                    console.log('Spotify Song Information Results: ');
                    console.log('--------------------------');
                    console.log("Artist(s): " + songData[i].artists[0].name);
                    console.log("Track Title: " + songData[i].name);
                    console.log("Link to Song: " + songData[i].preview_url);
                    console.log("Album Title: " + songData[i].album.name);
                    console.log('--------------------------');
                }
            }
        } else {
            console.log("Error :" + err);
            return;
        }
    });
    log();
}


function getMedia(nodeArg) {
  
    if (!nodeArg) {
      
        nodeArg = "Mr. Nobody";    
        
        // Then run a request to the OMDB API
        request("http://www.omdbapi.com/?t=" + nodeArg + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                console.log('');
                console.log('OMDB Movie Information: ');
                console.log('--------------------------');
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year of Release: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Countries produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                console.log('--------------------------');
            }
        });
    }
    log();
}

function doit() {
    fs.readFile('random.txt', "utf8", function (error, data) {

        if (error) {
            console.log(error);
        }
        
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(" ");

        // Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
        if (dataArr[0] === "Spotify A Song") {
            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        } else if (dataArr[0] === "List my Recent Tweets") {
            var tweetname = dataArr[1].slice(1, -1);
            twitter(tweetname);
        } else if (dataArr[0] === "Get movie details") {
            var movie_name = dataArr[1].slice(1, -1);
            movie(movie_name);
        }

    });
    log();
};

function log() {

    fs.appendFile('./log.txt', nodeArgv + ", ", function(err) {

        // If an error was experienced we say it.
        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        }

    });
};