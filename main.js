$(document).ready(function () {
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

    function addNumbers() {
        var digits = setFixedPoint();
        // take the sum float, convert it to an int by multiplying it by 10^digits after sum's .
        // round it, then convert it back to a float by dividing it by 10^digits
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
            } //parse float
            /*for (var i = sumSlice.length - 1; i >= 0; i--) {
                console.log("sumSlice looping: " + i);
                if (sumSlice.charAt(i) !== 0) {
                    sumFinal = sumSlice.slice(0, i + 1);
                    console.log("sum final: " + sumFinal);
                    i = -1;
                }
            }*/
        }

        /*console.log("sum digits: " + sumPrecision);
        //var sumConverted = Math.round(sum * Math.pow(10, sumPrecision)) / Math.pow(10, sumPrecision);
        //console.log("sum converted: " + sumConverted);
        console.log("10 pow: " + Math.pow(10, sumPrecision));
        console.log("times sum: " + (sum * Math.pow(10, sumPrecision)));
        console.log("rounded: " + Math.round(sum * Math.pow(10, sumPrecision)));*/

        display.textContent = parseFloat(sumFinal);//.toFixed(digits);
        numbers[0] = parseFloat(sumFinal); //parseFloat(sum).toFixed(digits);
        numbers.pop();
        console.log("Array after adding: " + numbers);
        sizeDisplay();
    }

    function subtractNumbers() {
        console.log("Numbers to be subtracted: " + numbers);
        difference = numbers[0] - numbers[1];
        numbers[0] = difference;
        numbers.pop();
        console.log("Array after subtracting: " + numbers);

        display.textContent = difference;
        sizeDisplay();
    }

    function equals() {
        equal = false;
        //console.log("Numbers on equal: " + numbers)
        if (numbers.length === 1) {
            numbers.push(parseFloat(numStr));
        }
        if (addition === true) {
            addNumbers();
        } else if (subtraction === true) {
            subtractNumbers();
        }
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
        addition = false;
        subtraction = false;
        equal = false;
        sum = 0;
        pixel = 50;
        numbers = [];

        sizeDisplay();

        console.log("All cleared");
    }

    var numberPad = document.getElementById("number-pad");

    var numberPadNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numberPadOperands = ["+", "-", "x", "&#247;"];

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
                    if (subtraction === true) {
                        subtractNumbers();
                    } else {
                        addNumbers();
                    }
                }
                subtraction = false;
                addition = true;

            } else if (targetValue === "-") {
                if (numbers.length === 2) {
                    if (addition === true) {
                        addNumbers();
                    } else {
                        subtractNumbers();
                    }
                }
                addition = false;
                subtraction = true;
            }

            // ALL CLEAR
        } else if (targetValue === "AC") {
            allClear();
        }
    })
})