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
var input = process.argv[3];
var tweetsArray = [];
var song = [];
//console.log(nodeArgv);


var params = {
    screen_name: 'nodejs',
    count: 20
};
// on screen menu
inquirer.prompt([
    {
     type: "list",
     message: "What is your command, Master?",
     choices: ["List my Recent Tweets", "Spotify A Song", "Get movie details", "Do something else"],
     name: "commands"
   }
])
.then(function(inquirerResponse) {
    switch(inquirerResponse.commands) {
        case "List my Recent Tweets":
            getRecentTweets();
            break;
        case "Spotify A Song":
            getMediaDetails("song");
            break;
        case "Get movie details":
            getMediaDetails("movie");
            break;
        case "Do something else":
             doit()
            //getTextFromRandom();
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
                
                for(i=0; i < tweetsArray.length; i++){
						console.log("Created at: " + tweetsArray[i].created_at);
						console.log("Text: " + tweetsArray[i].text);
						console.log('--------------------------------------');
					}
            } else {
                console.log(error);
            };
        });
    }
}

function getMediaDetails(input) {

    var spotify = new Spotify(keys.spotify);
    //console.log(song);
    if (!input){
        input = 'The Sign';
    }

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        song = data.tracks.items[0];
        console.log("------Artists-----");
        console.log('');
        console.log('Spotify Song Information Results: ');
        console.log('--------------------------');
        console.log("Artist(s): " + song.artists[0].name);
        console.log("Track Title: " + song.name);
        console.log("Link to Song: " + song.preview_url);
        console.log("Album Title: " + song.album.name);
        console.log('--------------------------');
    });
}

//getMediaDetails(song);
//getMediaDetails(movie);

function getMediaDetails(movie) {
    if (nodeArgv === "movie-this") {

        if (input.length < 1) {

            input = "Mr. Nobody";
        };

        // Then run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?t=" + nodeArgv[3] + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                // console.log(JSON.parse(body));
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
            } else {
                console.log(error);
            }
        });

    } else {

        function getTextFromRandom() {
            fs.readFile('random.txt', 'utf8', function (err, data) {
                if (err) throw err; {

                    var arr = data.split(',');

                    nodeArgv = arr[0].trim();
                    getMediaDetails(song);
                }

            });

        }
    }
   getTextFromRandom();
}

function doit() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
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
		} else if(dataArr[0] === "Get movie details") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
		
  	});

};