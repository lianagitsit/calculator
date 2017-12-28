$(document).ready(function(){
    console.log("ready");

    var a, b;
    var clicks = 0;
    var numStr = "";
    var targetValue;
    var addition = false;
    var subtraction = false;
    var equal = false;
    var sum;
    var difference;
    var pixel = 50;

    var display = document.getElementById("display");

    function getNumber() {
        //console.log("This element was clicked: " + targetValue);
        numStr += targetValue;
        display.textContent = numStr;
        console.log(numStr);

        sizeDisplay();

        /*if (numStr.length > 10 && numStr.length < 13){
            pixel -= 5;
        } else if (numStr.length > 12 && numStr.length < 15){ //>= 13 && numStr.length < 15){
            pixel -= 2.5;
        } */

        //display.style.fontSize = "40px";

    }

    function addNumbers() {
        sum = a + b;
        /*if (sum.toString().length > 12){
            display.style.fontSize = "20px";
        }*/
        display.textContent = sum;
        console.log(a + " + " + b + " = " + sum);
        sizeDisplay();
    }

    function subtractNumbers(){
        difference = a - b;
        /*if (difference.toString().length > 12){
            display.style.fontSize = "20px";
        }*/

        display.textContent = difference;
        sizeDisplay();
    }

    function sizeDisplay(){
        if (display.textContent.toString().length > 10 && display.textContent.toString().length < 13) {
            pixel -= 5;
        } else if (display.textContent.toString().length > 12){ //&& display.textContent.toString().length < 15){
            display.textContent = "ERR: OVERFLOW";
            pixel = 35;
        } 

        display.style.fontSize = pixel + "px";

    }

    function allClear(){
        
        if (targetValue === "AC"){
            display.textContent = "0";
        }

        a = 0;
        b = 0;
        numStr = "";
        addition = false;
        equal = false;
        sum = 0;
        pixel = 50;

        console.log("All cleared");
    }

    var numberPad = document.getElementById("number-pad");

    numberPad.addEventListener("click", function(e){
        targetValue = e.target.value;
        // make a numbers array and use indexOf? an operators array?
        if (targetValue >= 0 && targetValue <= 9){
            if (numStr.length >= 14){
                console.log("pixels: " + pixel);
                return;
            } else {
                getNumber();
            }
        } else if (targetValue === "+"){
            addition = true;
            a = parseInt(numStr);
            console.log(a + " + ");
            numStr = "";
            pixel = 50;
        } else if (targetValue === "="){
            equal = true;
            b = parseInt(numStr);
            if (addition === true){
                addNumbers();
            } else if (subtraction === true){
                subtractNumbers();
            }
            allClear();
        } else if (targetValue === "AC"){
            allClear();
        } else if (targetValue === "-"){
            subtraction = true;
            a = parseInt(numStr);
            numStr = "";
            pixel = 50;
        }
    })
})