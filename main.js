$(document).ready(function () {
    console.log("ready");

    var numStr = "";
    var targetValue;
    var addition = false;
    var subtraction = false;
    var multiplication = false;
    var division = false;
    var negative = false;
    var equal = false;
    var pixel = 50;
    var numbers = [];
    const MAX_LENGTH = 11;
    const ERR_DIVIDE_BY_0 = "Can't divide by 0";

    var display = document.getElementById("display");
    var numberPad = document.getElementById("number-pad");

    // Builds the string of digits to be operand
    function getNumber() {
        equal = true;
        if (!((targetValue >= 0 && targetValue <= 9) || targetValue === "." || targetValue === "posneg")) {
            return;
        } else {
            if (!numStr && targetValue === ".") {
                numStr = "0";
            }
            if (numStr.indexOf(".") !== -1 && targetValue === ".") {
                return;
            }
            if (targetValue === "posneg") {
                if (negative === true) {
                    numStr = "-" + numStr;
                    //console.log("numStr was positive, now it is: " + numStr);
                } else {
                    numStr = numStr.slice(1);
                    //console.log("numStr was negative, now it is: " + numStr);
                }
            } else {
                numStr += targetValue;
            }
            display.textContent = numStr;
            sizeDisplay();
        }
    }

    function calculate() {
        //console.log("Numbers to be calculated: " + numbers);
        var lastDigit, result, resultStr, resultPrecision, resultSlice, resultFinal;

        if (addition === true) {
            // handles user entering n+=
            if (equal === false && !numStr) {
                result = numbers[0] + numbers[0];
                numStr = numbers[0];
            } else {
                result = numbers[0] + numbers[1];
            }
        } else if (subtraction === true) {
            if (equal === false && !numStr) {
                result = numbers[0] - numbers[0];
                numStr = numbers[0];
            } else {
                result = numbers[0] - numbers[1];
            }
        } else if (multiplication === true) {
            if (equal === false && !numStr) {
                result = numbers[0] * numbers[0];
                numStr = numbers[0];
            } else {
                result = numbers[0] * numbers[1];
            }
        } else if (division === true) {
            if (equal === false && !numStr) {
                result = numbers[0] / numbers[0];
                numStr = numbers[0];
            } else {
                result = numbers[0] / numbers[1];
            }
        }

        resultStr = result.toString();
        resultFinal = resultStr;

        // If the number is a float, handle precision
        if (resultStr.indexOf(".") !== -1) {
            resultPrecision = (resultStr.length - 1) - (resultStr.indexOf("."));

            // If floating point precision produces a bonkers float, truncate the last digit and
            // handle the remaining digits (only need to truncate for 0000000001?)
            if (resultPrecision > MAX_LENGTH) {
                resultSlice = resultStr.slice(0, -1);
                //console.log("precision too large, " + resultSlice.length + " characters truncated: " + resultSlice);
                lastDigit = resultSlice.charAt(resultSlice.length - 1);
                //console.log("last: " + lastDigit);
                for (var i = resultSlice.length - 1; i >= 0; i--) {
                    //console.log("Now looping");
                    if (resultSlice.charAt(i) !== lastDigit) {
                        if (lastDigit === "9") {
                            resultFinal = resultSlice.slice(0, i) + (parseInt(resultSlice.charAt(i)) + 1).toString();
                        } else if (lastDigit === "0") {
                            resultFinal = resultSlice.slice(0, i + 1);
                        } else {
                            resultFinal = resultSlice.slice(0, MAX_LENGTH);
                        }
                        i = -1;
                    }
                }
            }
        }

        if (division === true && numbers[1] === 0) {
            //console.log("can't divide by 0");
            display.textContent = ERR_DIVIDE_BY_0;
            allClear();
        } else {
            display.textContent = parseFloat(resultFinal);
            numbers[0] = parseFloat(resultFinal);
            numbers.pop();
            sizeDisplay();
        }
        //console.log("Array after calculating: " + numbers);
    }

    // this is technically unnecessary, but I wanted to fiddle with handling larger numbers
    function sizeDisplay() {
        var displayContent = display.textContent.toString();

        if (displayContent.length === MAX_LENGTH) {
            pixel = 40;
        } else if (displayContent === ERR_DIVIDE_BY_0) {
            pixel = 27;
        } else if (displayContent.length > 10 && displayContent.length <= MAX_LENGTH) {
            pixel -= 5;
        } else if (displayContent.length > MAX_LENGTH) {
            if (negative === true && displayContent.length === MAX_LENGTH + 1) {
                display.textContent = numStr;
            } else {
                display.textContent = "ERR: OVERFLOW";
                pixel = 35;
            }
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
        addition = false;
        equal = false;
        negative = false;
        pixel = 50;
        numbers = [];

        sizeDisplay();
        //console.log("All cleared");
    }

    // event listener function
    function calculatorInputs(e) {
        var numberPadOperators = ["+", "-", "x", "d", "\/", "*"];

        if (e.type === "click") {
            targetValue = e.target.value;
            //console.log("target was CLICKED: " + targetValue);
        } else if (e.type === "keydown") {
            targetValue = e.key;
            //console.log("target was KEYDOWN: " + targetValue);
        }

        if (targetValue === "Backspace") {
            if (equal === false) {
                return;
            }
            numStr = numStr.slice(0, -1);
            display.textContent = numStr;
        } else if (targetValue === "=" || targetValue === "Enter") {         // Equals
            equal = false;
            if (targetValue === "Enter"){
                e.preventDefault();     // Allows enter key to execute equals even if another button has focus
            }
            // If equal is clicked without operands...
            if (numbers.length === 0 && !numStr) {
                return;
            // If equal is clicked after only one operand...
            } else if (numStr && numbers.length === 0) {
                //console.log("numStr occupied: " + numStr);
                numbers.push(parseFloat(numStr));
            // If equal is clicked after a full operation...
            } else if (numbers.length === 1) {
                numbers.push(parseFloat(numStr));
                calculate();
            }
            //console.log("numbers on clicking equals: " + numbers);

        } else if (targetValue === "posneg") {
            if (!numStr) {
                //console.log("numStr's empty, no neg toggle");
                return;
            } else {
                if (equal === false) {
                    numStr = numbers[0].toString();
                }
                if (numStr.charAt(0) === "-") {
                    negative = false;
                } else {
                    negative = true;
                }
                getNumber();
            }
        } else if ((targetValue >= 0 && targetValue <= 9) || targetValue === ".") {   // 0-9 and decimal point
            if (numStr.length > MAX_LENGTH) {
                //console.log("max length reached");
                sizeDisplay();
            } else {
                if (equal === false) {
                    numStr = "";
                    numbers = [];
                    pixel = 50;
                }
                getNumber();
            }
        } else if (numberPadOperators.indexOf(targetValue) !== -1) {         // Operands
            if (numbers.length === 0 || (numbers.length === 1 && equal === true && numStr)) {
                if (negative === true) {
                    numbers[0] = parseFloat(numStr);
                    // console.log("operator clicked and neg is true, numbers are: " + numbers);
                } else {
                    numbers.push(parseFloat(numStr));
                }
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
                negative = false;

            } else if (targetValue === "-") {   // Subtraction
                if (numbers.length === 2) {
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = false;
                subtraction = true;
                negative = false;
            } else if (targetValue === "x" || targetValue === "*") {   // Multiplication
                if (numbers.length === 2) {
                    calculate();
                }
                addition = false;
                multiplication = true;
                division = false;
                subtraction = false;
                negative = false;
            } else if (targetValue === "d" || targetValue === "\/") {     // Division
                if (numbers.length === 2) {
                    calculate();
                }
                addition = false;
                multiplication = false;
                division = true;
                subtraction = false;
                negative = false;
            }
        } else if (targetValue === "AC") {      // All clear
            allClear();
        } else if (targetValue === "CE") {      // Clear entry
            numStr = "";
            display.textContent = "0";
        }
    }

    document.addEventListener("keydown", calculatorInputs);
    numberPad.addEventListener("click", calculatorInputs);
})