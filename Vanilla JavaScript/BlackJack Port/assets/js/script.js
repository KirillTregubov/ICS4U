// Constants
var NUM_SUITS = 4;
var NUM_FACES = 13;
var BLACK_JACK = 21;
var MIN_BET = 5;
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Other Variables
var maxMoney;
var isHit;
var endImages;
var timer;
var cardStack;
var hash;
var origin;
// Player Variables
var playerBalance;
var currentBet;
var isBetValid;
var isPlayerDone;
var playerNumAces;
var playerHand;
var playerHandValueLowAce;
var playerHandValue;
var playerCardsShown;
// Dealer Variables
var dealerNumAces;
var dealerHand;
var dealerHandValueLowAce;
var dealerHandValue;
var dealerCardsShown;

function startGame() {
    playerBalance = 500;
    maxMoney = 0;
    transition(true, "bet", resetValues);
}

function continueGame() {
    transition(true, "bet");
    setTimeout(function () {
        resetValues();
    }, 500);
}

function placeBet() {
    updateBet();
    if (isBetValid) {
        playerBalance -= currentBet;

        let dealerCard = getCard();
        dealerHand.push(dealerCard);
        if (isAce(dealerCard))
            dealerNumAces++;
        dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
        dealerHandValue = updateHandValue(dealerHandValueLowAce, dealerNumAces);

        for (let i = 0; i < 2; i++) {
            let playerCard = getCard();
            playerHand.push(playerCard);
            if (isAce(playerCard))
                playerNumAces++;
            playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, playerCard);
            playerHandValue = updateHandValue(playerHandValueLowAce, playerNumAces);
        }

        transition(false, "play");
        preloadImages();
        timer = setInterval(displayCards, 700);
        if (playerHandValue == BLACK_JACK) {
            isPlayerDone = true;
            updatePlayerMessage("Blackjack!!");
        }
        showActions();
        document.getElementById("hash").innerHTML = hash;
        document.getElementById("hashWrapper").style.opacity = 1;
    }
}

function hit() {
    let card = getCard();
    playerHand.push(card);
    if (isAce(card))
        playerNumAces++;
    playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, card);
    playerHandValue = updateHandValue(playerHandValueLowAce, playerNumAces);

    isHit = true;
    preloadImages();
    timer = setInterval(displayCards, 200);
}

function continueHit() {
    if (playerHandValue > BLACK_JACK) {
        updatePlayerMessage("Bust!!");
        endGame();
    } else if (playerHandValue == BLACK_JACK || playerHandValueLowAce == BLACK_JACK) {
        updatePlayerMessage("Blackjack!!");
        endGame();
    }
}

function stand() {
    updatePlayerMessage("");
    endGame();
}

function endGame() {
    document.getElementById("buttonWrapper").style.opacity = document.getElementById("continueWrapper").style.opacity = 0;
    while (dealerHandValue < 17) {
        let dealerCard = getCard();
        dealerHand.push(dealerCard);
        if (isAce(dealerCard))
            dealerNumAces++;
        dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
        dealerHandValue = updateHandValue(dealerHandValueLowAce, dealerNumAces);
    }

    endImages = true;
    preloadImages();
    timer = setInterval(displayCards, 700);
}

function continueEndGame() {
    if (playerHandValue > BLACK_JACK)
        updatePlayerMessage("House Wins!!");
    else if ((playerHandValue > dealerHandValue && playerHandValue <= BLACK_JACK) || (dealerHandValue > BLACK_JACK && playerHandValue <= BLACK_JACK)) {
        playerBalance += currentBet * 2;
        maxMoney += currentBet;
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
    document.getElementById("endWrapper").style.opacity = 1;
}

function goToEnd() {
    let child;
    if (playerBalance >= MIN_BET) {
        document.getElementById("restartButton").innerText = "Forfeit";
        document.getElementById("restartButton").classList.add("secondary");
        document.getElementById("restartButton").onclick = quit;
        document.getElementById("endMessage").innerText = "Continue playing?";
        //document.getElementById("finalRestart").innerHTML = "Quit";
        child = document.createElement('a');
        child.classList.add("button");
        child.onclick = continueGame;
        child.innerText = "Yes";
    } else {
        child = document.createElement('h2');
        child.innerText = "Your overall winnings were $" + maxMoney + ".";
    }

    document.getElementById("end").insertChildAtIndex(child, 1);
    transition(false, "end");
}

function quit() {
    transition(false, "end", updateQuit);
}

function updateQuit() {
    document.getElementById("end").innerHTML = "<h1 id=\"endMessage\" class=\"special\">Thanks for Playing!</h1> <a id=\"restartButton\" class= \"button\" onclick=\"startGame();\">Restart</a>"
    child = document.createElement('h2');
    child.innerText = "Your overall winnings were $" + maxMoney + ".";
    document.getElementById("end").insertChildAtIndex(child, 1);
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

function transition(useNav, nextSection, command) {
    let current = document.getElementsByClassName("current")[0];
    let next = document.getElementById(nextSection);
    let nav = document.getElementById("nav");

    updateBalance();
    current.style.opacity = '0';
    setTimeout(function () {
        current.style.display = "none";
        if (useNav)
            nav.style.display = "block";
        try {
            command();
        } catch (e) {}
        next.style.display = "flex";
        setTimeout(function () {
            if (useNav)
                nav.style.opacity = '1';
            next.style.opacity = '1';
        }, 200);
    }, 500);
    current.classList.remove("current");
    next.classList.add("current");
}

function displayCards() {
    let elem, card;
    if (!(dealerCardsShown == dealerHand.length)) {
        elem = document.getElementsByClassName("cards")[0];
        card = dealerHand[dealerCardsShown++];
    } else if (!(playerCardsShown == playerHand.length)) {
        elem = document.getElementsByClassName("cards")[1];
        card = playerHand[playerCardsShown++];
    } else {
        return;
    }

    var e = document.createElement('img');
    e.src = "assets/images/cards/" + card + ".png";
    elem.appendChild(e);
    window.getComputedStyle(e).opacity;
    e.className += 'shown';

    if (elem.childElementCount > 3) {
        for (let i = 0; i < elem.childElementCount; i++)
            elem.getElementsByTagName('img')[i].classList.add("smaller");
    }
    if (playerCardsShown + dealerCardsShown == playerHand.length + dealerHand.length) {
        clearInterval(timer);
        timer = 0;
        if (endImages) {
            endImages = false;
            continueEndGame();
        } else if (isHit) {
            isHit = false;
            continueHit();
        }
    }
}

function preloadImages() {
    let playerImages = playerCardsShown;
    let dealerImages = dealerCardsShown;

    try {
        while (!(playerImages == playerHand.length) || !(dealerImages == dealerHand.length)) {
            if (!(playerImages == playerHand.length)) {
                var _img = new Image();
                _img.src = "assets/images/cards/" + playerHand[playerImages++] + ".png";
            } else if (!(dealerImages == dealerHand.length)) {
                var _img = new Image();
                _img.src = "assets/images/cards/" + dealerHand[dealerImages++] + ".png";
            }
        }
    } catch (e) {}
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
    isHit = false;
    endImages = false;
    cardStack = [];
    hash = "";
    currentBet = null;
    isBetValid = false;
    isPlayerDone = false;
    playerNumAces = 0;
    playerHand = [];
    playerHandValueLowAce = 0;
    playerHandValue = 0;
    playerCardsShown = 0;
    dealerNumAces = 0;
    dealerHand = [];
    dealerHandValueLowAce = 0;
    dealerHandValue = 0;
    dealerCardsShown = 0;

    // Clear existing cards
    for (let i = 0; i < 2; i++)
        document.getElementsByClassName("cards")[i].innerHTML = "";
    document.getElementById("endWrapper").style.opacity = 1;
    document.getElementById("endWrapper").style.display = "none";
    document.getElementById("resultMessage").innerText = "";
    document.getElementById("end").innerHTML = "<h1 id=\"endMessage\" class=\"special\">You Lost!</h1> <a id=\"restartButton\" class= \"button\" onclick=\"startGame();\">Restart</a>"
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
    for (var i = 0; i < 2; i++)
        hash += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
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
    return card.indexOf("A") != -1;
}

function updateHandValue(handValueLowAce, numAces) {
    if (numAces > 0 && handValueLowAce <= BLACK_JACK - 10)
        handValueLowAce += 10;

    return handValueLowAce;
}

function updateHandValueLowAce(handValue, card) {
    return handValue + getCardValue(card);
}

function openCredits() {
    document.getElementById("creditsLink").innerHTML = "<a onclick=\"goBack();\">Return</a>";
    origin = document.getElementsByClassName("current")[0].id;
    transition(true, "credits");
}

function goBack() {
    document.getElementById("creditsLink").innerHTML = "<a onclick=\"openCredits();\">Credits</a>";
    transition(true, origin);
    origin = "";
}

// Taken from Stack Overflow
Element.prototype.insertChildAtIndex = function (child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
}