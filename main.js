$(document).ready(function () {
    console.log("ready");

    var numStr = "";
    var targetValue;
    var addition = false;
    var subtraction = false;
    var multiplication = false;
    var division = false;
    var equal = false;
    var sum;
    var difference;
    var pixel = 50;
    var numbers = [];
    const MAX_LENGTH = 12;

    var display = document.getElementById("display");

    function getNumber() {
        //console.log("This element was clicked: " + targetValue);
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

    function setFixedPoint() {
        var longest = (numbers[0].toString().length - 1) - (numbers[0].toString().indexOf("."));
        var lengthB = (numbers[1].toString().length - 1) - (numbers[1].toString().indexOf("."));
        if (lengthB > longest) {
            longest = lengthB;
        }
        return longest;
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


        // if resultPrecision is absurdly large, truncate it, then cut off trailing 0s
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

        
        display.textContent = parseFloat(resultFinal);
        numbers[0] = parseFloat(resultFinal); 
        numbers.pop();
        console.log("Array after calculating: " + numbers);
        sizeDisplay();

    }

    /*function addNumbers() {
        var digits = setFixedPoint();
        console.log("Numbers to be added: " + numbers);
        sum = numbers[0] + numbers[1];
        var sumStr = sum.toString();
        var sumFinal = sumStr;
        var sumPrecision = (sumStr.length - 1) - (sumStr.indexOf("."));
        var sumSlice;
        var lastDigit;

        // if sumPrecision is absurdly large, truncate it, then cut off trailing 0s
        if (sumPrecision > MAX_LENGTH) {
            sumSlice = sumStr.slice(0, -1);
            console.log("precision too large, " + sumSlice.length + " characters truncated: " + sumSlice);
            lastDigit = sumSlice.charAt(sumSlice.length - 1);
            console.log("last: " + lastDigit);
            for (var i = sumSlice.length - 1; i >= 0; i--) {
                console.log("Now looping");
                if (sumSlice.charAt(i) !== lastDigit) {
                    if (lastDigit === "9") {
                        sumFinal = sumSlice.slice(0, i) + (parseInt(sumSlice.charAt(i)) + 1).toString();
                        console.log("It's 9, here's the final sum: " + sumFinal);
                    } else if (lastDigit === "0") {
                        sumFinal = sumSlice.slice(0, i + 1);
                    } else {
                        sumFinal = sumSlice.slice(0, MAX_LENGTH);
                    }
                    i = -1;
                }
            } 
        }

        
        display.textContent = parseFloat(sumFinal);//.toFixed(digits);
        numbers[0] = parseFloat(sumFinal); //parseFloat(sum).toFixed(digits);
        numbers.pop();
        console.log("Array after adding: " + numbers);
        sizeDisplay();
    }*/

    /*function subtractNumbers() {
        console.log("Numbers to be subtracted: " + numbers);
        difference = numbers[0] - numbers[1];
        numbers[0] = difference;
        numbers.pop();
        console.log("Array after subtracting: " + numbers);

        display.textContent = difference;
        sizeDisplay();
    }*/

    function equals() {
        equal = false;
        if (numbers.length === 1) {
            numbers.push(parseFloat(numStr));
        }
        calculate();
    }

    function sizeDisplay() {
        if (display.textContent.toString().length > 10 && display.textContent.toString().length <= MAX_LENGTH) {
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

    var numberPadNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numberPadOperands = ["+", "-", "x", "d"];

    numberPad.addEventListener("click", function (e) {
        targetValue = e.target.value;

        if (targetValue === "=") {
            equal = true;
            equals();
        } else if ((targetValue >= 0 && targetValue <= 9) || targetValue === ".") {
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
        } else if (numberPadOperands.indexOf(targetValue) !== -1) {
            if (numbers.length === 0 || (numbers.length === 1 && equal === true && numStr)) {
                numbers.push(parseFloat(numStr));
                numStr = "";
                pixel = 50;
            } else if (numbers.length === 1 && equal === false) {
                numStr = "";
                getNumber();
            }
            // ADDITION
            if (targetValue === "+") {
                if (numbers.length === 2) {
                    calculate();
                }
                subtraction = false;
                multiplication = false;
                division = false;            
                addition = true;

            } else if (targetValue === "-") {
                if (numbers.length === 2) {
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = false;
                subtraction = true;
            } else if (targetValue === "x") {
                if (numbers.length === 2){
                    calculate();
                }
                addition = false;
                multiplication = true;
                division = false;
                subtraction = false;
            } else if (targetValue === "d"){
                if (numbers.length === 2){
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = true;
                subtraction = false;
            }

            // ALL CLEAR
        } else if (targetValue === "AC") {
            allClear();
        }
    })
})