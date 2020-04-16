pragma solidity ^0.5.0;

contract Transaction {
    
    string public name = "Transaction Contract";
    string public variableName = "";
    
    function changeName(string memory _name) public {
        variableName = _name;
    }
}