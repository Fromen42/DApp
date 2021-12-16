pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    uint public sides =0;
    uint8  public currentBet = 0;
    uint  public entry = 0;
    uint  roll = 0;
    mapping(uint => Product) public products;

	uint private randomFactor;

    struct Product {
        uint id;
        string name;
        uint price;
        uint sides;
        uint  currentBet;  
        uint entry;
        uint roll;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        uint sides,
        uint  currentBet,
        uint entry,
        address payable owner,
        bool purchased
    );

   
  event BetStats(
    uint id,
    string name,
    uint price,
    uint roll,
    address payable owner,
    bool purchased
    );

    constructor() public {
        name = "Ali's Die Roll";
        randomFactor = 6;
    }
    // function random() private view returns (uint) {
    //    	uint256 blockValue = uint256(blockhash(block.number-1 + block.timestamp));
    //     blockValue = blockValue + uint256(randomFactor);
    //     return uint(blockValue + 1);
    // }
    function random(uint _id) private view returns (uint) {
        Product memory _product = products[_id];
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _product.sides)));
        // convert hash to integer
        // players is an array of entrants
        
    }
    
    function rollDie(uint _id) public payable{
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.entry);
        // Require that the product has not been purchased already
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        
        // _product.sides = random();
        randomFactor += random(_id);
        randomFactor = (randomFactor % _product.sides) + 1 ;
        _product.roll = randomFactor;
            if(randomFactor >= _product.currentBet){
                _product.purchased = true;
                // _product.owner = msg.sender; 
                
                // Pay the seller by sending them Ether
                address(msg.sender).transfer(_product.price);
                // Trigger an event
                emit BetStats(productCount, _product.name, _product.price, _product.roll, msg.sender, true);
            }else{
                _product.purchased = false;
                emit BetStats(productCount, _product.name, _product.price, _product.roll, msg.sender, false);
            }
            address(_seller).transfer(msg.value);
            products[_id] = _product;
    }
	
    
    function createProduct(string memory _name, uint _price, uint _sides, uint _currentBet, uint _entry) public payable {
    // Require a valid name
    require(bytes(_name).length > 0);
    // Require a valid price
    require(_price > 0);
     // Require a valid sides
    require(_sides > 2);
      // Require a valid sides
    require(_entry > 0);
      // Require a valid sides
    require(_sides >= _currentBet && _currentBet > 0);
    // Increment product count
    require(msg.value >= _price);
    productCount ++;
    // Create the product
    products[productCount] = Product(productCount, _name, _price, _sides, _currentBet, _entry, 0, msg.sender, false);
    // Trigger an event
    emit ProductCreated(productCount, _name, _price, _sides, _currentBet, _entry, msg.sender, false);
}




}