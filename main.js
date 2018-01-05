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

    var display = document.getElementById("display");

    function getNumber() {
        //console.log("This element was clicked: " + targetValue);
        equal = true;
        if (!((targetValue >= 0 && targetValue <= 9) || targetValue === ".")) {
            return;
        } else {
            if (!numStr && targetValue === "."){
                numStr = "0";
            }
            if (numStr.indexOf(".") !== -1 && targetValue === "."){
                return;
            }
            numStr += targetValue;
            display.textContent = numStr;
            sizeDisplay();
        }
    }

    function addNumbers() {
        console.log("Numbers to be added: " + numbers);
        sum = numbers[0] + numbers[1];
        display.textContent = parseFloat(sum);
        numbers[0] = sum;
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
        if (display.textContent.toString().length > 10 && display.textContent.toString().length < 13) {
            pixel -= 5;
        } else if (display.textContent.toString().length > 12) {
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
            if (numStr.length >= 14) {
                console.log("pixels: " + pixel);
                return;
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