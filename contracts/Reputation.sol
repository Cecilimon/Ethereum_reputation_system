pragma solidity ^0.5.8;

import "./ratestorage.sol";

contract Reputation {

  address internal storageAddress;
  uint internal waitTime;
  mapping (address => uint) internal lastRating;

  event Error(
      address sender,
      string message
  );

  event Rating(
      address by,
      address who,
      int rating
  );

  event scoreValue(
    int scoreVal
  );
  /**
   * Delay ratings to be at least waitTime apart
   */
  modifier delay() {
      if (lastRating[msg.sender] > now - waitTime) {
          revert();
      }
      _;
  }

/*Contract that takes ratings and calculates a reputation score.  It uses the
    RatingStore contract as its data storage.
    Ratings can be from -5(worst) to 5(best) and are weighted according to the
    score of the rater. This weight can have a significant skewing towards the
    positive or negative but the representative score can not be below -5 or
    above 5. Raters can not rate more often than waitTime, nor can they rate
    themselves. */

//waitTime is usually 60
  constructor(address _storageAddress, uint _wait) public {
    storageAddress = _storageAddress;
    waitTime = _wait;
  }

  function rate(address who, int rating) external delay payable {

      // Check rating for sanity
      require(rating <= 5 && rating >= -5, "Rate between -5 and 5");

      // A rater can not rate himself
      require(who != msg.sender, "You can rate yourself");

      // Get an instance of the RateStorage contract
      RateStorage store = RateStorage(storageAddress);

      // Standard weight
      int weight = 0;

      // Convert rating into a fake-float
      int workRating = rating * 100;

      // We need the absolute value
      int absRating;
      if (rating >= 0) {
          absRating = workRating;
      } else {
          absRating = -workRating;
      }

      // Get details on sender if available
      int senderScore;
      uint senderRatings;
      int senderCumulative = 0;
      (senderScore, senderRatings) = store.get(msg.sender);

      // Calculate cumulative score if available for use in weighting. We're
      // acting as-if the two right-most places are decimals
      if (senderScore != 0) {
          senderCumulative = (senderScore / (int(senderRatings) * 100)) * 100;
      }

      // Calculate the weight if the sender has a positive rating
      if (senderCumulative > 0 && absRating != 0) {

          // Calculate a weight to add to the final rating calculation.  Only
          // raters who have a positive cumulative score will have any extra
          // weight.  Final weight should be between 40 and 100 and scale down
          // depending on how strong the rating is.
          weight = (senderCumulative + absRating) / 10;

          // We need the final weight to be signed the same as the rating
          if (rating < 0) {
              weight = -weight;
          }

      }

      // Add the weight to the rating
      workRating += weight;

      // Set last rating timestamp
      lastRating[msg.sender] = now;

      // Send event of the rating
      emit Rating(msg.sender, who, workRating);

      // Add the new rating to their score
      store.add(who, workRating);

  }

  /**
   * Returns the cumulative score for an address
   * @param who The address to lookup
   * @return score The cumulative score
   */
  function getScore(address who) external view returns (int score) {

      // Get an instance of our storage contract: RateStorage
      RateStorage store = RateStorage(storageAddress);

      int cumulative;
      uint ratings;

      // Get the raw scores from RateStorage
      (cumulative, ratings) = store.get(who);

      // Calculate the score as a false-float as an average of all ratings
      score = cumulative / int(ratings);

      // We only want to display a maximum of 500 or minimum of -500, even
      // if it's weighted outside of that range
      if (score > 500) {
          score = 500;
      } else if (score < -500) {
          score = -500;
      }

    }

  /**
   * Returns the cumulative score and count of ratings for an address
   * @param who The address to lookup
   * @return score The cumulative score
   * @return count How many ratings have been made
   */
  function getScoreAndCount(address who) external view returns (int score, uint ratings) {

      // Get an instance of our storage contract: RateStorage
      RateStorage store = RateStorage(storageAddress);

      int cumulative;

      // Get the raw scores from RateStorage
      (cumulative, ratings) = store.get(who);

      // The score should have room for 2 decimal places, but ratings is a
      // single count
      score = cumulative / int(ratings);

  }
}
