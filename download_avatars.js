var request = require('request');
var token = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + token.GITHUB_TOKEN
    }

  };

  request(options, function(err, res, body) {
    body = JSON.parse(body);
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(element => {
    console.log(element.avatar_url);
  });
  //console.log("Result:", result);
  //console.log(token.GITHUB_TOKEN)
});
