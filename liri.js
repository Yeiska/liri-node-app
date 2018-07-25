require("dotenv").config();

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var keys = require("./keys");
var request = require("request");
var fs = require('fs');
// Store all of the arguments in an array
var nodeArgv = process.argv;

var params = {
  screen_name: 'nodejs',
  count: 20
};

show();
function show() {
  if (nodeArgv === "my-tweets") {

      client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
              console.log('My Last 20 Tweets: ');
              console.log('--------------------------');
              tweets.forEach(function(individualTweet) {
                  console.log('Time Posted: ' + individualTweet.created_at);
                  console.log('Tweet: ' + individualTweet.text);
                  console.log('--------------------------');
              });
          } else {
              console.log(error);
          };
      });

      show();

  } else if (nodeArgv === "spotify-this-song") {

      if (nodeArgv.length < 1) {

          option = "The Sign Ace of Base";
      };

      spotify.search({ type: 'track', query: option }, function(err, data) {
          if (err) {
              console.log('Error occurred: ' + err);
              return;
          }
          console.log('');
          console.log('Spotify Song Information Results: ');
          console.log('--------------------------');
          console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
          console.log("Track Title: " + data.tracks.items[0].name);
          console.log("Link to Song: " + data.tracks.items[0].preview_url);
          console.log("Album Title: " + data.tracks.items[0].album.name);
          console.log('--------------------------');
      });

      show();

  } else if (nodeArgv === "movie-this") {

      if (nodeArgv.length < 1) {

        option = "Mr. Nobody";
      };

      // Then run a request to the OMDB API with the movie specified
      request("http://www.omdbapi.com/?t=" + nodeArgv + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {

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

      show();

  } else if (input1 === "do-what-it-says") {

      log();

      fs.readFile('random.txt', 'utf8', function(err, data) {
          if (err) throw err;
          // console.log(data);

          var arr = data.split(',');

          nodeArgv = arr[0].trim();
          show();

      });

  }
};
