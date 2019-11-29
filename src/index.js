App = {

  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load accounts.
    $.getJSON('Accounts.json', function(data) {
      var accountRow = $('#accountRow');
      var accountTemplate = $('#accountTemplate');

      for (i = 0; i < data.length; i ++) {
        accountTemplate.find('.account-name').text(data[i].name).attr('name-id', data[i].id);
        accountTemplate.find('.account-address').text(data[i].contract_address).attr('account-id',data[i].id);
        accountTemplate.find('.rate-num').attr('rating-id', data[i].id);
        accountTemplate.find('.rate-btn').attr('data-id', data[i].id);
        accountTemplate.find('.account-rate').text(data[i].rate).attr('rate-id', data[i].id);
        accountTemplate.find('.getRate-btn').attr('data-id', data[i].id);
        accountTemplate.find('.user-classify').attr('user-id', data[i].id).hide();

        accountRow.append(accountTemplate.html());
      }
    });
    $('#accountTemplate').hide();

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);
    //init contract was the important code
    return App.initContract();

  },

  initContract: function() {
    $.getJSON('../build/contracts/Reputation.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ReputationArtifact = data;
      App.contracts.Reputation = TruffleContract(ReputationArtifact);

      // Set the provider for our contract
      App.contracts.Reputation.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

    });
    $.getJSON('../build/contracts/RateStorage.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var RateStorageArtifact = data;
      App.contracts.RateStorage = TruffleContract(RateStorageArtifact);

      // Set the provider for our contract
      App.contracts.RateStorage.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

    });
    $.getJSON('../build/contracts/Auction.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AuctionArtifact = data;
      App.contracts.Auction = TruffleContract(AuctionArtifact);

      // Set the provider for our contract
      App.contracts.Auction.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.rate-btn', App.handleRate);
    $(document).on('click', '.getRate-btn', App.getRate);
    $(document).on('click', '.bid-btn', App.handleBid);
    // $(document).on('click', '.bid-btn', App.showBidder);

  },



  showRate: async function(rating, id) {

    console.log("data comes to showRate");
    console.log(rating);
    $("[rate-id = '"+id+"']").html(rating);

  },

  refresh: async function(){
    window.location.reload();
  },

  handleRate: async function(event) {
    event.preventDefault();

    var accountId = parseInt($(event.target).data('id'));
    console.log(accountId+" is the id");

    var rateInstance = null;

    web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Reputation.deployed().then(async function(instance) {
        rateInstance = instance;
        // Execute rate as a transaction by sending account

        var rateAddress = $("[account-id = '"+accountId+"']").filter('span').text();
        var rateToWho = $(".account-name[name-id = '"+accountId+"']").filter('span').text();
        var rating = null;
        rating = $(".rate-num[rating-id = '"+accountId+"']").filter('textarea').val();
        rating = parseInt(rating);
        console.log(rating+" is getting send");
        await rateInstance.rate(rateAddress,rating);
        var ratingEvent = null;
        ratingEvent = rateInstance.Rating();
        ratingEvent.watch(function(error, result) {
          if(!error) {
            window.alert("Rated "+rating+" points to "+rateToWho);
            console.log('alert');
            return App.refresh();
          } else {
            console.log(error);
          }
        })
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  getRate: function(event) {

    var accountId = parseInt($(event.target).data('id'));
    var getAddress = $("[account-id = '"+accountId+"']").filter('span').text()
    console.log(getAddress+" and "+accountId+" is getting send");



    App.contracts.Reputation.deployed().then(function(instance) {
        var rateInstance = instance;

        // Execute getScore as a transaction by sen 0ding0x0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d16CB5b77226C7FCdB91329A6F96213a0a18FD72d a0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72dccount
        return rateInstance.getScore(getAddress);

      }).then( async function (value) {
        var val = value.toNumber();
        $(".user-classify[user-id = '"+accountId+"']").filter('span').replaceWith(App.classifyScore(val)).show();
        return await App.showRate(val, accountId);
      }).catch(function(err) {
        console.log(err.message);
      });

  },

  classifyScore: function(score) {
    var score_val = score;
    if (score_val >= 250) {
      return "Excellent user";
    }
    else if(score_val <250 && score_val>=200) {
      return "Good user";
    }
    else if(score_val <200 && score_val>=150) {
      return "Bad user";
    }
    else if(score_val<150) {
      return "Worst user"
    }
  },

  handleBid: async function(event){
    event.preventDefault();
    var objectId = parseInt($(event.target).data('id'));
    console.log(objectId+" is the id");

    var bidInstance

    web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Auction.deployed().then(async function(instance) {
        bidInstance = instance;

        // Execute rate as a transaction by sending account
        var objectName = $(".product-name").filter('span').text();
        var bidderName = $(".logged-user").filter('span').text();

        var bidCharge = $(".charge-num[bidding-id = '"+objectId+"']").filter('textarea').val();
        bidCharge = parseInt(bidCharge);
        console.log(bidderName+" is sending and, "+bidCharge+" is getting send");
        await bidInstance.bid(bidderName,bidCharge,objectId);
        var biddingEvent = bidInstance.Bid();
        biddingEvent.watch(function(error, result) {
          if(!error) {
            App.getBidder(objectId, account);
            window.alert("Name : "+bidderName+" bidded "+objectName+" for "+bidCharge);
          } else {
            console.log(error);
          }
        })
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBidder: async function(id, _account){
    var objectId = id ;
    var bidCharge;
    var bidderName;
    var account = _account
    var bidInstance

    App.contracts.Auction.deployed().then(function(instance) {
        bidInstance = instance;
        console.log("This is the account in getBidder : "+account);
        // Execute getScore as a transaction by sen 0ding0x0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d16CB5b77226C7FCdB91329A6F96213a0a18FD72d a0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72dccount
        return bidInstance.getBidderName(account);
        // bidCharge = bidInstance.getBidderCharge(account);
        // bidderName = bidderName.toString();
        // bidCharge = bidCharge.toNumber();


      }).then(function(value){
        bidderName = value
      }).then(function(){
        return bidInstance.getBidderCharge(account);
      }).then(function(value){
        bidCharge = value.toNumber();
        return App.showBidder(bidderName, objectId, bidCharge);
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  showBidder: async function(bidder, _id, _charge){
    console.log("data comes to showBidder");
    console.log(bidder+" is bidding "+_charge+" amount");
    var bidderInfo = bidder + " : " +_charge;
    console.log(bidderInfo);
    // $("[rate-id = '"+id+"']").replaceWith(rating).html();
    $('#bidderSpace').find('.first-bid').html(bidderInfo);

  }


};



$(function() {
  $(window).load(function() {

    App.init();
  });
});
