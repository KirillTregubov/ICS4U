var NUM_SUITS = 4;
var NUM_FACES = 13;
var BLACK_JACK = 21;
var MIN_BET = 5;
var HIT = 1;
var playerBalance;

// document.name.addEventListener('click', function() { /* do stuff here*/ }, false);
function startGame() {
    console.log("Started Game");
    playerBalance = 500;

    // Show player betting view
    document.getElementById("start").style.opacity = '0';
    setTimeout(function () {
        document.getElementById("start").style.display = "none";
        document.getElementById("bet").style.display = "flex"; // Change "bet
        updateBalance();
        setTimeout(function () {
            document.getElementById("bet").style.opacity = '1';
            document.getElementById("nav").style.display = "block";
        }, 100);
    }, 500);
}

var currentBet;

function updateBet() {
    currentBet = document.getElementById("betInput").value;

    document.getElementById("betValue").innerHTML = currentBet;
   // document.querySelectorAll("body")[0].append('<p>hi</p>');
}

function updateBalance() {
    document.getElementById("playerBalance").innerHTML = "$" + playerBalance;
    console.log("balance");
    
}

//var gameOver;

/*
window.onload = function () {
    //main();
}

function main() {
    playerBalance = 500;
    gameOver = false;

    while (!isGameOver) {
        var playerNumAces;
        var playerHand;
        var playerHandValueLowAce;
        var playerHandValue;
        
        var dealerNumAces;
        var dealerHand;
        var dealerHandValueLowAce;
        var dealerHandValue;

        var currentBet = getValidBet(playerBalance);
    }
}

function getValidBet(money) {
    console.log("Please enter your bet ($" + MIN_BET + "minimum)");
    console.log("> ");
}*/

function testMe() {
    // console.log('This is a test.'); print to console
    var arr = [];
    arr[2] = "Hello";
    arr[1] = 5;
    arr[0] = function () {
        alert("Haha!");
    };
    //arr[0]();

    var obj = {};
    obj.var1 = 6;
    obj.var2 = arr;
    obj.func1 = function () {
        console.log(this.var1);
    };

    var obj2 = {};
    obj2.var1 = 5;
    obj2.var2 = 10;

    var jsonString = JSON.stringify(obj2);
    console.log(jsonString);

    var obj3 = JSON.parse(jsonString);
}