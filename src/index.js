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
      // return App.markAdopted();
    });
    $.getJSON('../build/contracts/RateStorage.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var RateStorageArtifact = data;
      App.contracts.RateStorage = TruffleContract(RateStorageArtifact);

      // Set the provider for our contract
      App.contracts.RateStorage.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.rate-btn', App.handleRate);
    $(document).on('click', '.getRate-btn', App.getRate);

  },



  showRate: async function(rating, id) {

    console.log("data comes to showRate");
    console.log(rating);
    $("[rate-id = '"+id+"']").replaceWith(rating).html();

  },

  handleRate: async function(event) {
    event.preventDefault();

    var accountId = parseInt($(event.target).data('id'));
    console.log(accountId+" is the id");

    var rateInstance;

    web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Reputation.deployed().then(async function(instance) {
        rateInstance = instance;

        // Execute rate as a transaction by sending account
        // return rateInstance.rate(accountId, {from: account});

        var rateAddress = $("[account-id = '"+accountId+"']").filter('span').text();
        var rateToWho = $(".account-name[name-id = '"+accountId+"']").filter('span').text();
        var rating = $(".rate-num[rating-id = '"+accountId+"']").filter('textarea').val();
        rating = parseInt(rating);
        console.log(rating+" is getting send");
        await rateInstance.rate(rateAddress,rating);
        var ratingEvent = rateInstance.Rating();
        ratingEvent.watch(function(error, result) {
          if(!error) {
            window.alert("Rated "+rating+" points to "+rateToWho);
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
    // event.preventDefault();

    // var accountId = parseInt($(event.target).data('id'));
    var accountId = parseInt($(event.target).data('id'));
    var getAddress = $("[account-id = '"+accountId+"']").filter('span').text()
    console.log(getAddress+" and "+accountId+" is getting send");



    App.contracts.Reputation.deployed().then(function(instance) {
        var rateInstance = instance;

        // Execute getScore as a transaction by sen 0ding0x0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d16CB5b77226C7FCdB91329A6F96213a0a18FD72d a0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72d0x16CB5b77226C7FCdB91329A6F96213a0a18FD72dccount
        return rateInstance.getScore(getAddress);

        // console.log(rate);


      }).then( async function (value) {
        var val = value.toNumber();
        return await App.showRate(val, accountId);
      }).catch(function(err) {
        console.log(err.message);
      });

  },

  sortScore: function(event) {

  }


};



$(function() {
  $(window).load(function() {

    App.init();
  });
});
