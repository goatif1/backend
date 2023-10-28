//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract RoulettesContract {
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

}