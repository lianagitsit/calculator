$(document).ready(function(){
    console.log("ready");

    var numStr = "";
    var targetValue;
    var addition = false;
    var subtraction = false;
    var equal = false;
    var sum;
    var difference;
    var pixel = 50;
    var numbers = [];

    var display = document.getElementById("display");

    function getNumber() {
        //console.log("This element was clicked: " + targetValue);
        equal = true;
        if (!(targetValue >= 0 && targetValue <= 9)){
            return;
        } else {
            numStr += targetValue;
            display.textContent = numStr;
            sizeDisplay();
        }
    }

    function addNumbers() {
        console.log("Numbers to be added: " + numbers);
        sum = numbers[0] + numbers[1];
        display.textContent = sum;
        numbers[0] = sum;
        numbers.pop();
        console.log("Array after adding: " + numbers);
        sizeDisplay();
    }

    function subtractNumbers(){
        console.log("Numbers to be subtracted: " + numbers);
        difference = numbers[0] - numbers[1];
        numbers[0] = difference;
        numbers.pop();
        console.log("Array after subtracting: " + numbers);

        display.textContent = difference;
        sizeDisplay();
    }

    function equals(){
        //console.log("Numbers on equal: " + numbers)
        if (numbers.length === 1){
            numbers.push(parseInt(numStr));
        }
        if (addition === true){
            addNumbers();
        } else if (subtraction === true){
            subtractNumbers();
        }
        equal = false;
    }

    function sizeDisplay(){
        if (display.textContent.toString().length > 10 && display.textContent.toString().length < 13) {
            pixel -= 5;
        } else if (display.textContent.toString().length > 12){ 
            display.textContent = "ERR: OVERFLOW";
            pixel = 35;
        } 
        display.style.fontSize = pixel + "px";
    }

    function allClear(){
        
        if (targetValue === "AC"){
            display.textContent = "0";
        }

        numStr = "";
        addition = false;
        subtraction = false;
        equal = false;
        sum = 0;
        pixel = 50;
        numbers = [];

        console.log("All cleared");
    }

    var numberPad = document.getElementById("number-pad");

    var numberPadNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numberPadOperands = ["+", "-", "x", "&#247;", "="];

    numberPad.addEventListener("click", function(e){
        targetValue = e.target.value;
        // TODO: implement conditionals using indexOf in above arrays?
        if (targetValue >= 0 && targetValue <= 9){
            if (numStr.length >= 14){
                console.log("pixels: " + pixel);
                return;
            } else {
                if (equal === false){
                    numStr = "";
                    numbers = [];
                }
                getNumber();
            }
        } else if (targetValue === "+"){

            // TODO: move this into its own block applied to all operands
            if (numbers.length === 0 || (numbers.length === 1 && equal === true)){
                numbers.push(parseInt(numStr));
                numStr = "";
                pixel = 50;    
            } else if (numbers.length === 1 && equal === false){
                numStr = "";
                getNumber();
            }

            if (numbers.length === 2){
                if (subtraction === true){
                    subtractNumbers();
                } else {
                    addNumbers();
                }
                numStr = "";
                pixel = 50;    
            }
            subtraction = false;
            addition = true;
        } else if (targetValue === "="){
            equal = true;
            equals();
        } else if (targetValue === "AC"){
            allClear();
        } else if (targetValue === "-"){
            if (numbers.length === 0 || (numbers.length === 1 && equal === true)){
                numbers.push(parseInt(numStr));
                numStr = "";
                pixel = 50;    
            } else if (numbers.length === 1 && equal === false){
                numStr = "";
                getNumber();
            }

            if (numbers.length === 2){
                if (addition === true){
                    addNumbers();
                } else {
                    subtractNumbers();
                }
                numStr = "";
                pixel = 50;    
            }
            addition = false;
            subtraction = true;
        }
    })
})