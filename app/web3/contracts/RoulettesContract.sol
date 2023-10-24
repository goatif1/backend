//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract RoulettesContract {
    struct Option {
        uint256 id;
        uint256 weight;
    }

    struct Roulette {
        uint256 id;
        mapping(uint256 => Option) options;
    }

    // State variables
	address public immutable owner;
    mapping(uint256 => Roulette) roulettes;

    event RouletteCreated(uint256 id);
    event OptionWeightIncremented(uint256 rouletteId, uint256 optionId, uint256 newWeight);

    // Constructor
    constructor(address _owner) {
		owner = _owner;
	}

    // Control functions
    function rouletteExists(uint256 rouletteId) private view returns (bool){
        return roulettes[rouletteId].id != 0;
    }

    function createRoulette (uint256 rouletteId, Option[] memory rouletteOptions) public returns (bool){
        // Check requirements
        require(rouletteId > 0);
        require(!rouletteExists(rouletteId));
        require(rouletteOptions.length > 0);

        // Create new roulette
        Roulette storage newRoulette = roulettes[rouletteId];
        newRoulette.id = rouletteId;

        for (uint256 i = 0; i < rouletteOptions.length; i++){
            Option memory temp_option = rouletteOptions[i];
            newRoulette.options[temp_option.id] = Option(temp_option.id, temp_option.weight);
            // roulettes[rouletteId].options[temp_option.id] = Option(temp_option.id, temp_option.weight);
        }

        emit RouletteCreated(rouletteId);
        return true;
    }




    // -------------------- TESTING ONLY --------------------
    function helloWorld () public pure returns (uint256) {
        return 3838;
    }

}