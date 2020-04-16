pragma solidity ^0.5.0;

contract Transaction {
    
    string public name = "Transaction Contract";
    uint public counter = 0;
    
    function increaseCounter(uint _increment) public returns(uint) {
        counter = counter + _increment;
        return counter;
    }
}