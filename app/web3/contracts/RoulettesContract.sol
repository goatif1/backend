//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract RoulettesContract {
    struct Bet {
        uint256 id_roulette;
        uint256 id_option;
        uint256 weigth;
        address bookie;
    }

    struct Option {
        uint256 id;
        uint256 weight;
    }

    struct Roulette {
        uint256[] options_ids;
        mapping(uint256 => Option) options;
    }

    // State variables
	address public immutable owner;
    mapping(uint256 => Roulette) private roulettes;
    uint256[] public roulettes_ids;
    Bet[] private bets;

    // Constructor
    constructor(address _owner) {
		owner = _owner;
	}

    // Control functions
    function rouletteExists(uint256 rouletteId) private view returns (bool){
        for (uint256 i = 0; i < roulettes_ids.length; i++){
            if (roulettes_ids[i] == rouletteId){
                return true;
            }
        }
        return false;
    }

    function optionExists(uint256 rouletteId, uint256 optionId) private view returns (bool) {
        // Check if the specified roulette exists
        if (rouletteExists(rouletteId)) {
            // Access the specific roulette using its ID
            Roulette storage roulette = roulettes[rouletteId];

            // Check if the specified option ID exists within the roulette
            for (uint256 i = 0; i < roulette.options_ids.length; i++) {
                if (roulette.options_ids[i] == optionId) {
                    return true; // Option found, it exists
                }
            }
        }
        return false; // Option not found or the roulette itself doesn't exist
    }


    function createRoulette (uint256 rouletteId, Option[] memory rouletteOptions) public returns (bool){
        // Check requirements
        require(rouletteId > 0);
        require(rouletteExists(rouletteId) == false);
        require(rouletteOptions.length > 0);

        // Create new roulette
        roulettes_ids.push(rouletteId);
        Roulette storage newRoulette = roulettes[rouletteId];
        newRoulette.options_ids = new uint256[](rouletteOptions.length);

        for (uint256 i = 0; i < rouletteOptions.length; i++){
            Option memory temp_option = rouletteOptions[i];
            newRoulette.options[temp_option.id] = Option(temp_option.id, temp_option.weight);
            newRoulette.options_ids[i] = temp_option.id;
        }

        return true;
    }

    function getRouletteOptions (uint256 rouletteId) public view returns (Option[] memory){
        // Check requirements
        require(rouletteId > 0);
        require(rouletteExists(rouletteId) == true);

        uint256 num_options = roulettes[rouletteId].options_ids.length;

        Option[] memory options = new Option[](num_options);

        for (uint256 i = 0; i < num_options; i++){
            // Temporary data
            uint256 temp_id = roulettes[rouletteId].options_ids[i];
            Option memory temp_option = roulettes[rouletteId].options[temp_id];

            options[i] = Option(temp_option.id, temp_option.weight);
        }

        return options;
    }

    function betRouletteOption (uint256 roulette_id, uint256 option_id, uint256 weight_inc) external payable {
        // Check requirements
        require(roulette_id > 0);
        require(option_id > 0);
        require(optionExists(roulette_id, option_id) == true);
        require(weight_inc > 0);
        // 1 ether is 1000000000000000000 wei
        uint256 cost = weight_inc / 100;
        require(msg.value >= cost);

        Bet memory new_bet = Bet(roulette_id, option_id, weight_inc, msg.sender);
        bets.push(new_bet);

        roulettes[roulette_id].options[option_id].weight += weight_inc;
    }

}