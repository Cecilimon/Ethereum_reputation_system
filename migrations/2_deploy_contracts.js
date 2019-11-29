var RateStorage = artifacts.require("RateStorage");
var Reputation = artifacts.require("Reputation");
var Auction = artifacts.require("Auction")

module.exports = function(deployer, network, accounts) {
  var manager = accounts[0];
  // var fee = 200000000000000;
  var wait = 0;

  deployer.deploy(RateStorage)
  // Deploy etherep
  .then(function() {
    return deployer.deploy(Reputation,RateStorage.address, wait);
  }).then(function(){
    return deployer.deploy(Auction);
  });


  };
