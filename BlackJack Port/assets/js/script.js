// Constants
var NUM_SUITS = 4;
var NUM_FACES = 13;
var BLACK_JACK = 21;
var MIN_BET = 5;
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Player Variables
var cardStack;
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

function restart() {
    updateBalance();
    document.getElementById("end").style.opacity = '0';
    document.getElementById("nav").style.opacity = '0';
    setTimeout(function () {
        document.getElementById("end").style.display = "none";
        document.getElementById("nav").style.display = "none";
        document.getElementById("start").style.display = "flex";
        setTimeout(function () {
            document.getElementById("start").style.opacity = '1';
        }, 200);
    }, 500);
}

function startGame() {
    console.log("Started Game");
    playerBalance = 500;
    resetValues();
    transition(true, "start", "bet");
}

function continueGame() {
    transition(true, "end", "bet");
    setTimeout(function () {
        resetValues();
    }, 500);
}

function placeBet() {
    updateBet();
    if (isBetValid) {
        playerBalance -= currentBet;

        // Show play view
        transition(false, "bet", "play");
        setTimeout(function () {
            let dealerCard = getCard();
            addCard(dealerHand, dealerCard);
            if (isAce(dealerCard))
                dealerNumAces++;
            dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
            dealerHandValue = updateHandValue(dealerHandValueLowAce, dealerNumAces);

            setTimeout(function () {
                for (let i = 0; i < 2; i++) {
                    let playerCard = getCard();
                    addCard(playerHand, playerCard);
                    if (isAce(playerCard))
                        playerNumAces++;
                    playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, playerCard);
                    playerHandValue = updateHandValue(playerHandValueLowAce, playerNumAces);
                }
                console.log("Dealer: " + dealerHand + " Values: " + dealerHandValue + " " + dealerHandValueLowAce);
                console.log("Player: " + playerHand + " Values: " + playerHandValue + " " + playerHandValueLowAce);
                setTimeout(function () {
                    if (playerHandValue == BLACK_JACK) {
                        isPlayerDone = true;
                        updatePlayerMessage("Black Jack!!");
                    }
                    showActions();
                    document.getElementById("hash").innerHTML = hash;
                    document.getElementById("hashWrapper").style.opacity = 1;
                }, 500);
            }, 800);
        }, 1000);
    }
}

function hit() {
    let card = getCard();
    addCard(playerHand, card);

    if (isAce(card))
        playerNumAces++;

    playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, card);
    playerHandValue = updateHandValue(playerHandValueLowAce, playerNumAces);

    if (playerHandValue > BLACK_JACK) {
        updatePlayerMessage("Bust!!");
        endGame();
    } else if (playerHandValue == BLACK_JACK || playerHandValueLowAce == BLACK_JACK) {
        updatePlayerMessage("Black Jack!!");
        endGame();
    }
}

function stand() {
    updatePlayerMessage("");
    endGame();
}

function endGame() {
    document.getElementById("buttonWrapper").style.opacity = document.getElementById("continueWrapper").style.opacity = 0;
    setTimeout(function () {
        while (dealerHandValue < 17) {
            let dealerCard = getCard();
            addCard(dealerHand, dealerCard);
            if (isAce(dealerCard))
                dealerNumAces++;
            dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
            dealerHandValue = updateHandValue(dealerHandValueLowAce, dealerNumAces);
        }

        console.log("Dealer: " + dealerHand + " Values: " + dealerHandValue + " " + dealerHandValueLowAce);
        console.log("Player: " + playerHand + " Values: " + playerHandValue + " " + playerHandValueLowAce);
        //setTimeout(function () {}, 1500);

        setTimeout(function () {
            if (playerHandValue > BLACK_JACK)
                updatePlayerMessage("House Wins!!");
            else if ((playerHandValue > dealerHandValue && playerHandValue <= BLACK_JACK) || (dealerHandValue > BLACK_JACK && playerHandValue <= BLACK_JACK)) {
                playerBalance += currentBet * 2;
                updatePlayerMessage("You Win!!");
            } else if (playerHandValue == dealerHandValue && playerHandValue <= BLACK_JACK) {
                playerBalance += currentBet;
                updatePlayerMessage("Push! Your bet has been returned.");
            } else {
                updatePlayerMessage("Dealer Wins!!");
            }
            updateBalance();
            document.getElementById("buttonWrapper").style.display = document.getElementById("continueWrapper").style.display = "none";
            document.getElementById("endWrapper").style.display = "flex";
            setTimeout(function () {
                document.getElementById("endWrapper").style.opacity = 1;
            }, 200);
        }, 1000);
    }, 1000);
}

function goToEnd() {
    console.log(playerBalance);
    if (playerBalance >= MIN_BET) {
        document.getElementById("endMessage").innerText = "Continue playing?";
        var child = document.createElement('a');
        child.classList = "button";
        child.onclick = continueGame;
        child.innerText = "Yes";
        var parent = document.getElementById("end");
        parent.insertChildAtIndex(child, 1);
    }
    transition(false, "play", "end");
}

function addCard(hand, card) {
    let elem;
    if (hand == dealerHand) {
        elem = document.getElementsByClassName("cards")[0];
    } else {
        elem = document.getElementsByClassName("cards")[1];
    }

    hand.push(card);
    var e = document.createElement('img');
    e.src = "assets/images/cards/" + card + ".png";
    elem.appendChild(e);
    window.getComputedStyle(e).opacity;
    e.className += 'shown';
    setTimeout(function () {
        if (elem.childElementCount > 3) {
            for (let i = 0; i < elem.childElementCount; i++)
                elem.getElementsByTagName('img')[i].style.height = "20vh";
        }
    }, 1000);
}

function showActions() {
    if (isPlayerDone) {
        document.getElementById("continueWrapper").style.display = "flex";
        setTimeout(function () {
            document.getElementById("continueWrapper").style.opacity = 1;
        }, 200);
    } else {
        document.getElementById("buttonWrapper").style.display = "flex";
        setTimeout(function () {
            document.getElementById("buttonWrapper").style.opacity = 1;
        }, 200);
    }
}

function updatePlayerMessage(message) {
    document.getElementById("resultMessage").innerHTML = message;
}

function transition(useNav, firstSection, secondSection) {
    updateBalance();
    document.getElementById(firstSection).style.opacity = '0';
    setTimeout(function () {
        document.getElementById(firstSection).style.display = "none";
        if (useNav)
            document.getElementById("nav").style.display = "block";
        document.getElementById(secondSection).style.display = "flex";
        setTimeout(function () {
            if (useNav)
                document.getElementById("nav").style.opacity = '1';
            document.getElementById(secondSection).style.opacity = '1';
        }, 100);
    }, 500);
}

function updateBet() {
    currentBet = parseInt(document.getElementById("betInput").value);
    // Check for errors
    let error = document.getElementById("betInputError");
    if (!currentBet) {
        error.innerHTML = "Please insert a valid number!";
        error.style.display = "block";
    } else if (currentBet < MIN_BET) {
        error.innerHTML = "Unable to bet less than the minimum!";
        error.style.display = "block";
    } else if (currentBet > playerBalance) {
        error.innerHTML = "Unable to bet more than your available balance!";
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
    cardStack = [];
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

    // Clear existing cards
    for (let i = 0; i < 2; i++)
        document.getElementsByClassName("cards")[i].innerHTML = "";
    document.getElementById("endWrapper").style.opacity = 1;
    document.getElementById("endWrapper").style.display = "none";
    document.getElementById("resultMessage").innerText = "";
    document.getElementById("end").innerHTML = "<h1 id=\"endMessage\" class=\"special\">You Lost!</h1> <a class = \"button\" onclick=\"restart();\">Restart</a>"
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
    let newCard = getFace() + getSuit();
    if (cardStack.includes(newCard)) {
        while (cardStack.includes(newCard))
            newCard = getFace() + getSuit();
    }
    cardStack.push(newCard);
    return newCard;
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

Element.prototype.insertChildAtIndex = function (child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
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