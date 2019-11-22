var RateStorage = artifacts.require("RateStorage");
var Reputation = artifacts.require("Reputation");

module.exports = function(deployer, network, accounts) {
  var manager = accounts[0];
  // var fee = 200000000000000;
  var wait = 60;

  deployer.deploy(RateStorage)
  // Deploy etherep
  .then(function() {
    return deployer.deploy(Reputation,RateStorage.address, wait)
  });


  };
