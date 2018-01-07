$(document).ready(function () {
    console.log("ready");

    var numStr = "";
    var targetValue;
    var addition = false;
    var subtraction = false;
    var multiplication = false;
    var division = false;
    var equal = false;
    var pixel = 50;
    var numbers = [];
    const MAX_LENGTH = 12;
    const ERR_DIVIDE_BY_0 = "Can't divide by 0";

    var display = document.getElementById("display");

    function getNumber() {
        equal = true;
        if (!((targetValue >= 0 && targetValue <= 9) || targetValue === ".")) {
            return;
        } else {
            if (!numStr && targetValue === ".") {
                numStr = "0";
            }
            if (numStr.indexOf(".") !== -1 && targetValue === ".") {
                return;
            }
            numStr += targetValue;
            display.textContent = numStr;
            sizeDisplay();
        }
    }

    function calculate(){
        console.log("Numbers to be calculated: " + numbers);
        var lastDigit, result, resultStr, resultPrecision, resultSlice, resultFinal;

        if (addition === true){
            result = numbers[0] + numbers[1];
        } else if (subtraction === true){
            result = numbers[0] - numbers [1];
        } else if (multiplication === true){
            result = numbers[0] * numbers[1];
        } else if (division === true){
            result = numbers[0] / numbers[1];
        }

        resultStr = result.toString();
        resultFinal = resultStr;
        resultPrecision = (resultStr.length - 1) - (resultStr.indexOf("."));


        // If floating point precision produces a bonkers float, truncate the last digit and
        // handle the remaining digits (only need to truncate for 0000000001?)
        if (resultPrecision > MAX_LENGTH) {
            resultSlice = resultStr.slice(0, -1);
            console.log("precision too large, " + resultSlice.length + " characters truncated: " + resultSlice);
            lastDigit = resultSlice.charAt(resultSlice.length - 1);
            console.log("last: " + lastDigit);
            for (var i = resultSlice.length - 1; i >= 0; i--) {
                console.log("Now looping");
                if (resultSlice.charAt(i) !== lastDigit) {
                    if (lastDigit === "9") {
                        resultFinal = resultSlice.slice(0, i) + (parseInt(resultSlice.charAt(i)) + 1).toString();
                        console.log("It's 9, here's the final result: " + resultFinal);
                    } else if (lastDigit === "0") {
                        resultFinal = resultSlice.slice(0, i + 1);
                    } else {
                        resultFinal = resultSlice.slice(0, MAX_LENGTH);
                    }
                    i = -1;
                }
            } 
        }

        if (division === true && numbers[1] === 0){
            console.log("can't divide by 0");
            display.textContent = ERR_DIVIDE_BY_0;
            allClear();
        } else {
            display.textContent = parseFloat(resultFinal);
            numbers[0] = parseFloat(resultFinal); 
            numbers.pop();   
            sizeDisplay(); 
        }
        console.log("Array after calculating: " + numbers);
    }

    function sizeDisplay() {
        if (display.textContent === ERR_DIVIDE_BY_0){
            pixel = 27;
        } else if (display.textContent.toString().length > 10 && display.textContent.toString().length <= MAX_LENGTH) {
            pixel -= 5;
        } else if (display.textContent.toString().length > MAX_LENGTH) {
            display.textContent = "ERR: OVERFLOW";
            pixel = 35;
        }
        display.style.fontSize = pixel + "px";
    }

    function allClear() {
        if (targetValue === "AC") {
            display.textContent = "0";
        }
        numStr = "";
        subtraction = false;
        multiplication = false;
        division = false;            
        addition = true;
        equal = false;
        pixel = 50;
        numbers = [];

        sizeDisplay();
        console.log("All cleared");
    }

    var numberPad = document.getElementById("number-pad");

    numberPad.addEventListener("click", function (e) {
        var numberPadOperators = ["+", "-", "x", "d"];
        targetValue = e.target.value;

        if (targetValue === "=") {         // Equals
            equal = false;
            // If equal is clicked without operands...
            if (numbers.length === 0 && !numStr){
                return;
            // If equal is clicked after only one operand...
            } else if (numStr && numbers.length === 0){
                console.log("numStr occupired: " + numStr);
                numbers.push(parseFloat(numStr));
            // If equal is clicked after a full operation...
            } else if (numbers.length === 1) {
                numbers.push(parseFloat(numStr));
                calculate();
            }
            console.log("numbers on clicking equals: " + numbers);
            
        } else if ((targetValue >= 0 && targetValue <= 9) || targetValue === ".") {   // 0-9 and decimal point
            if (numStr.length > MAX_LENGTH) {
                console.log("max length reached");
                sizeDisplay();
            } else {
                if (equal === false) {
                    numStr = "";
                    numbers = [];
                }
                getNumber();
            }
        } else if (numberPadOperators.indexOf(targetValue) !== -1) {
            if (numbers.length === 0 || (numbers.length === 1 && equal === true && numStr)) {
                numbers.push(parseFloat(numStr));
                numStr = "";
                pixel = 50;
            } else if (numbers.length === 1 && equal === false) {
                numStr = "";
                getNumber();
            }
            if (targetValue === "+") {         // Addition
                if (numbers.length === 2) {
                    calculate();
                }
                subtraction = false;
                multiplication = false;
                division = false;            
                addition = true;

            } else if (targetValue === "-") {   // Subtraction
                if (numbers.length === 2) {
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = false;
                subtraction = true;
            } else if (targetValue === "x") {   // Multiplication
                if (numbers.length === 2){
                    calculate();
                }
                addition = false;
                multiplication = true;
                division = false;
                subtraction = false;
            } else if (targetValue === "d"){     // Division
                if (numbers.length === 2){
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = true;
                subtraction = false;
            }
        } else if (targetValue === "AC") {      // All clear
            allClear();
        }
    })
})