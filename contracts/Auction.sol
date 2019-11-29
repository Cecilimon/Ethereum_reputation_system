pragma solidity ^0.5.3;


contract Auction {

  struct AuctionInfo {

    string name;
    uint charge;
    uint goodId;

  }

  struct Bidder {
    address[] bidder;
  }

  event Bid (
      string by,
      uint charge

  );

  event Error (
      uint length
  );


  mapping (uint => Bidder) internal mulBidders;


  mapping (address => AuctionInfo) internal auctionInfos;
  address[] bidderArray;

  //Adopting pet
  function bid(string memory bidder_name, uint charge ,uint objectId) public returns (uint) {
    require(objectId >= 0);

    //you can use the below code when you want to use Bidder as a array
    // Bidder memory bidder = Bidder(msg.sender);
    // mulBidders[objectId].push(bidder);

    mulBidders[objectId].bidder.push(msg.sender);

    setAuctionInfo(msg.sender,bidder_name, charge, objectId);
    emit Bid(bidder_name, charge);

    return objectId;
  }

  //get bidder name
  function getBidderName(address bidder) external view returns (string memory) {
    return auctionInfos[bidder].name;
  }

  //get bidder charge
  function getBidderCharge(address bidder) external view returns (uint) {
    return auctionInfos[bidder].charge;
  }

  //get bidders bidded product id
  function getBiddedObjecId(address bidder) external view returns (uint) {
    return auctionInfos[bidder].goodId;
  }

  function getBiddersAddressWithId(uint _id) external returns (address[] memory) {
     address[] memory tempBidder;
     bidderArray = tempBidder;

     for (uint i = 0; i <mulBidders[_id].bidder.length; i++) {
         bidderArray.push(mulBidders[_id].bidder[i]);

     }
     emit Error(tempBidder.length);

     return bidderArray;
  }


  function setAuctionInfo(address _address, string memory _name, uint _charge, uint _goodId) internal {


    auctionInfos[_address].name = _name;
    auctionInfos[_address].charge = _charge;
    auctionInfos[_address].goodId = _goodId;

  }

}
