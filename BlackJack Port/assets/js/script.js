// Constants
var NUM_SUITS = 4;
var NUM_FACES = 13;
var BLACK_JACK = 21;
var MIN_BET = 5;
var HIT = 1;
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Player Variables
var hash;
var playerBalance;
var currentBet;
var isBetValid;
var isPlayerDone;
var playerNumAces;
var playerHand;
var playerHandValueLowAce;
var playerHandValue;
// Dealer Variables
var dealerNumAces;
var dealerHand;
var dealerHandValueLowAce;
var dealerHandValue;

function startGame() {
    console.log("Started Game");
    playerBalance = 500;

    // Show bet placement view
    updateBalance();
    resetValues();
    transition(true, "start", "bet");
}

function placeBet() {
    updateBet();
    if (isBetValid) {
        playerBalance -= currentBet;

        // Process 
        var dealerCard = getCard();
        dealerHand[0] = dealerCard;
        if (isAce(dealerCard))
            dealerNumAces++;
        dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
        dealerHandValue = updateHandValue(dealerHandValueLowAce, dealerNumAces);

        for (let i = 0; i < 2; i++) {
            var playerCard = getCard();
            playerHand[i] = playerCard;
            if (isAce(playerCard))
                playerNumAces++;
            playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, playerCard);
            playerHandValue = updateHandValue(playerHandValueLowAce, playerNumAces);
        }

        console.log(hash);

        console.log("Dealer: " + dealerHand + " Values: " + dealerHandValue + " " + dealerHandValueLowAce);
        console.log("Player: " + playerHand + " Values: " + playerHandValue + " " + playerHandValueLowAce);

        //isPlayerDone = false;
        if (playerHandValue == BLACK_JACK) {
            isPlayerDone = true;
            console.log("BLACK JACK!!");
        }


        // Show play view
        updateBalance();
        updateDisplayedCards();
        fixCardOverflow();
        transition(false, "bet", "play");
    }
}

function updateDisplayedCards() {
    // Clear existing cards
    for (let i = 0; i < 2; i++)
        document.getElementsByClassName("cards")[i].innerHTML = "";
    // Update dealer's cards
    for (let i = 0; i < dealerHand.length; i++)
        document.getElementsByClassName("cards")[0].innerHTML += "<img src=\"assets/images/cards/" + dealerHand[i] + ".png\" />";
    // Update player's cards
    for (let i = 0; i < playerHand.length; i++)
        document.getElementsByClassName("cards")[1].innerHTML += "<img src=\"assets/images/cards/" + playerHand[i] + ".png\" />";
}

function fixCardOverflow() {
    if (document.getElementById("playerCards").childElementCount > 6) {
        for (let i = 0; i < document.getElementById("playerCards").childElementCount; i++)
            document.getElementById("playerCards").getElementsByTagName('img')[i].style.height = "20vh";
    }
}

function transition(useNav, firstSection, secondSection) {
    document.getElementById(firstSection).style.opacity = '0';
    setTimeout(function () {
        document.getElementById(firstSection).style.display = "none";
        if (useNav)
            document.getElementById("nav").style.display = "block";
        document.getElementById(secondSection).style.display = "flex";
        setTimeout(function () {
            if (useNav)
                document.getElementById("nav").style.opacity = '1'
            document.getElementById(secondSection).style.opacity = '1';
        }, 100);
    }, 500);
}

function updateBet() {
    currentBet = parseInt(document.getElementById("betInput").value);
    //console.log(currentBet); // debug

    // Check for errors
    let error = document.getElementById("betInputError");
    if (!currentBet) {
        error.innerHTML = "Bet is not a valid number!";
        error.style.display = "block";
    } else if (currentBet < MIN_BET) {
        error.innerHTML = "Bet is less than minimum!";
        error.style.display = "block";
    } else if (currentBet > playerBalance) {
        error.innerHTML = "Bet is more than your available balance!";
        error.style.display = "block";
    } else {
        isBetValid = true;
        error.innerHTML = '';
        error.style.display = "none";
    }
}

function updateBalance() {
    document.getElementById("playerBalance").innerHTML = "$" + playerBalance;
}

function resetValues() {
    hash = "";
    currentBet = null;
    isBetValid = false;
    isPlayerDone = false;
    playerNumAces = 0;
    playerHand = [];
    playerHandValueLowAce = 0;
    playerHandValue = 0;
    dealerNumAces = 0;
    dealerHand = [];
    dealerHandValueLowAce = 0;
    dealerHandValue = 0;
}

function enterDetector(e) {
    if (e.which == 13 || e.keyCode == 13) {
        this.blur();
    }
}

window.onload = function () {
    // Make enter deselect input
    document.getElementById('betInput').addEventListener('keyup', enterDetector, false);
}

// Treats Aces as a 1
function getCardValue(card) {
    if (card.length == 3)
        return 10;

    let face = parseInt(card.substring(0, 1));
    if (face)
        return face;
    else {
        if (card.substring(0, 1) == "A")
            return 1;
        else
            return 10;
    }
}

function updateHash(random) {
    for (var i = 0; i < 2; i++) {
        hash += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return random;
}

function getCard() {
    return getFace() + getSuit();
}

function getFace() {
    let x = (updateHash(Math.random()) * NUM_FACES + 2) | 0;

    if (x <= 10)
        return "" + x;
    else if (x == 11)
        return "J";
    else if (x == 12)
        return "Q";
    else if (x == 13)
        return "K";
    else
        return "A";
}

function getSuit() {
    let x = (updateHash(Math.random()) * NUM_SUITS) | 0;

    if (x == 0)
        return "S";
    else if (x == 1)
        return "D";
    else if (x == 2)
        return "H";
    else
        return "C";
}

function isAce(card) {
    return card.charAt(0) == "A";
}

function updateHandValue(handValueLowAce, numAces) {

    if (numAces > 0 && handValueLowAce <= BLACK_JACK - 10)
        handValueLowAce += 10;

    return handValueLowAce;
}

function updateHandValueLowAce(handValue, card) {
    return handValue + getCardValue(card);
}

/*
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