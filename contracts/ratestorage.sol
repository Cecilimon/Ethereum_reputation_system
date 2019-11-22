pragma solidity ^0.5.8;

contract RateStorage {
  struct Score {
      bool exists;
      int cumulativeScore;
      uint totalRatings;
  }

  mapping (address => Score) internal scores;

  /**
   * Set a Score
   * @param target The address' score we're setting
   * @param cumulative The cumulative score for the address
   * @param total Total individual ratings for the address
   * @return success If the set was completed successfully
   */
  function set(address target, int cumulative, uint total) external  {
      if (!scores[target].exists) {
          scores[target] = Score(true, 0, 0);
      }
      scores[target].cumulativeScore = cumulative;
      scores[target].totalRatings = total;
  }

  /**
   * Add a rating
   * @param target The address' score we're adding to
   * @param wScore The weighted rating to add to the score
   * @return success
   */
  function add(address target, int wScore) external  {
      if (!scores[target].exists) {
          scores[target] = Score(true, 0, 0);
      }
      scores[target].cumulativeScore += wScore;
      scores[target].totalRatings += 1;
  }
  /**
   * Get the score for an address
   * @param target The address' score to return
   * @return cumulative score
   * @return total ratings
   */
  function get(address target) external view returns (int, uint) {
      if (scores[target].exists == true) {
          return (scores[target].cumulativeScore, scores[target].totalRatings);
      } else {
          return (0,0);
      }
  }
}
