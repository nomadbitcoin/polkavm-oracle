// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IOracle
 * @dev Simple interface for interacting with price feeds
 * @notice This interface provides the essential functions for reading price data
 * @author Your Oracle Team
 */
interface IOracle {
    /**
     * @dev Emitted when a price is updated
     * @param symbol The price feed symbol (e.g., "BTC", "ETH")
     * @param price The updated price in wei
     * @param timestamp The block timestamp when the price was updated
     */
    event PriceUpdated(string indexed symbol, uint256 price, uint256 timestamp);

    /**
     * @dev Emitted when a new price feed is created
     * @param symbol The price feed symbol
     * @param price The initial price
     */
    event FeedCreated(string indexed symbol, uint256 price);

    /**
     * @dev Emitted when a price feed is deleted
     * @param symbol The price feed symbol
     */
    event FeedDeleted(string indexed symbol);

    /**
     * @dev Get the current price for a given symbol
     * @param _symbol The price feed symbol (e.g., "BTC", "ETH", "USDC")
     * @return The current price in wei
     * @notice Reverts if the feed doesn't exist
     * 
     * Usage example:
     * uint256 btcPrice = oracle.getPrice("BTC");
     * // Returns price in wei (e.g., 50000000000000000000 for $50,000)
     */
    function getPrice(string memory _symbol) external view returns (uint256);

    /**
     * @dev Get the timestamp when a price feed was last updated
     * @param _symbol The price feed symbol
     * @return The timestamp of the last update
     * @notice Reverts if the feed doesn't exist
     * 
     * Usage example:
     * uint256 lastUpdate = oracle.getLastUpdated("BTC");
     * // Returns block timestamp when price was last updated
     */
    function getLastUpdated(string memory _symbol) external view returns (uint256);

    /**
     * @dev Check if a price feed exists and is active
     * @param _symbol The price feed symbol
     * @return True if the feed exists and is active, false otherwise
     * 
     * Usage example:
     * bool exists = oracle.feedExists("BTC");
     * if (exists) {
     *     uint256 price = oracle.getPrice("BTC");
     * }
     */
    function feedExists(string memory _symbol) external view returns (bool);

    /**
     * @dev Get the version of the oracle contract
     * @return The version string
     * 
     * Usage example:
     * string memory version = oracle.version();
     * // Returns "0.1.0"
     */
    function version() external pure returns (string memory);
} 