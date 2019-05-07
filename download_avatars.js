var request = require('request');
var token = require('./secrets');
var fs = require('fs');
const gitRepo = {owner: process.argv[2], repo: process.argv[3]};

console.log('Welcome to the GitHub Avatar Downloader!');

if (!gitRepo.owner) {
  console.log("Wrong Arguments");
  return;
}
if (!gitRepo.repo) {
  console.log("Wrong Arguments");
  return;
}


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  };

  request(options, function (err, res, body) {
    body = JSON.parse(body);
    cb(err, body);
  });
}

getRepoContributors(gitRepo.owner, gitRepo.repo, function (err, result) {
  console.log("Errors:", err);
  result.forEach(element => {
    let path = "./avatars/" + element.login + ".jpg";
    downloadImageByURL(element.avatar_url, path);
  });
  //console.log("downloaded");
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log("Downloading! " + url);
    })//.on('end', function () {
    //  console.log("Downloaded!" + url);
    //})
    .pipe(fs.createWriteStream(filePath));
}


