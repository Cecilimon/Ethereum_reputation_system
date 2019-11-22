pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/etherep.sol";

contract TestEtherep {
  //Ther address of the adoption contract to be tested
  Etherep etherep = Etherep(DeployedAddresses.Etherep());

  //The id of the pet that will be used for testing
  uint expectedAccountId = 0;

  // The expected owner of the adopted pet is this contracts
  address expectedrater = address(this);




}
