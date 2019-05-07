var request = require('request');
var token = require('./secrets');
var fs = require('fs');
const gitRepo = {owner: process.argv[2], repo: process.argv[3]};

if (!gitRepo.owner || !gitRepo.repo) {
  console.log("Wrong number of arguments!!\nCorrect Format: node download_avatars.js owner repo");  
  return;
}

console.log('Welcome to the GitHub Avatar Downloader!');

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
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log("Downloading! " + url);
    })
    .pipe(fs.createWriteStream(filePath));
}


