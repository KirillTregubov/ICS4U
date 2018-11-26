// Constants
var NUM_SUITS = 4;
var NUM_FACES = 13;
var ANTE_STRAIGHT_FLUSH = 40;
var ANTE_THREE_OF_A_KIND = 30;
var ANTE_STRAIGHT = 6;
var STRAIGHT_FLUSH = 40;
var THREE_OF_A_KIND = 30;
var STRAIGHT = 6;
var FLUSH = 3;
var PAIR = 1;
var HIGH_CARD = 0;
var MIN_BET = 50;
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Other Variables
var timer;
var cardStack;
var hash;
var origin;
// Player Variables
var playerBalance;
var maxMoney;
var anteBet;
var ppBet;
var isAnteValid
var isPPValid;
var playerHand;
var playerCardsShown;
var playerAnteType;
var playerPPType;
// Dealer Variables
var dealerHand;
var dealerCardsShown;
var dealerPPType;

function startGame() {
    playerBalance = 1000;
    maxMoney = 0;
    transition(true, "bet", resetValues);
}

function continueGame() {
    transition(true, "bet");
    setTimeout(function () {
        resetValues();
    }, 500);
}

function placeBets() {
    updateAnte();
    updatePP();
    if (isAnteValid && isPPValid) {
        playerBalance -= anteBet + ppBet;

        for (let i = 0; i < 3; i++) {
            let playerCard = getCard();
            playerHand.push(playerCard);
        }
        playerPPType = updatePPType(playerHand);
        playerAnteType = updateAnteType(playerHand);

        // Display cards
        transition(false, "play");
        preloadPlayerImages();
        timer = setInterval(displayPlayerCards, 700);
    }
}

function placePlayBet() {
    playerBalance -= anteBet;
    updateBalance();

    for (let i = 0; i < 3; i++) {
        let dealerCard = getCard();
        dealerHand.push(dealerCard);
    }
    dealerPPType = updatePPType(dealerHand);

    // Display cards
    document.getElementById("buttonWrapper").style.opacity = 0;
    document.getElementsByClassName("cards")[0].style.opacity = 0;
    setTimeout(function () {
        document.getElementById("buttonWrapper").style.display = "none";
        document.getElementsByClassName("cards")[0].innerHTML = "";
        dealerCardsShown = 0;
        document.getElementsByClassName("cards")[0].style.opacity = 1;
        // Display cards
        preloadDealerImages();
        timer = setInterval(displayDealerCards, 700);
    }, 500);
}

function fold() {
    document.getElementById("resultMessage").innerText = "";
    updatePlayerMessage("Fold!!");
    document.getElementById("buttonWrapper").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("buttonWrapper").style.display = "none";
        document.getElementById("endWrapper").style.display = "flex";
        setTimeout(function () {
            document.getElementById("endWrapper").style.opacity = 1;
        }, 600);
    }, 600);
}

function continuePlay() {
    // Ante/Play calculation
    if (dealerPPType > playerPPType) {
        //console.log("dealer better");
        // no money
        updatePlayerMessage("You lost!!");
    } else {
        if (getHighestValue(dealerHand) < 12) {
            //console.log("Jack high or worse");
            updatePlayerMessage("Your play bet was returned!");
            addToBalance(anteBet);
        } else if (dealerPPType > 0 || getHighestValue(dealerHand) > 11) {
            //console.log("Queen high");
            if (playerHasBetterHand()) {
                //console.log("win");
                updatePlayerMessage("You won!!");
                addToBalance(anteBet * 3 + anteBet * playerAnteType);
                if (anteBet * playerAnteType)
                    updatePlayerMessage(" You won the x" + playerAnteType + " ante bonus.");
                //console.log("addded bonus");
            } else {
                //console.log("lose");
                // no money
                updatePlayerMessage("You lost!!");
            }
        }
    }

    // Pair Plus calculation
    if (ppBet > 0 && playerPPType > 0) {
        updatePlayerMessage(" You won the x" + playerPPType + " pair plus.");
        addToBalance(ppBet + ppBet * playerPPType);
    }
    updateBalance();
    document.getElementById("endWrapper").style.display = "flex";
    document.getElementById("endWrapper").style.opacity = 1;
}

function playerHasBetterHand() {
    if (playerPPType > dealerPPType || getHighestValue(playerHand) > getHighestValue(dealerHand))
        return true;
    return false;
}

function addToBalance(money) {
    playerBalance += money;
    maxMoney += money;
}

function goToEnd() {
    let child;
    if (playerBalance >= MIN_BET) {
        document.getElementById("restartButton").innerText = "Quit";
        document.getElementById("restartButton").classList.add("secondary");
        document.getElementById("restartButton").onclick = quit;
        document.getElementById("endMessage").innerText = "Continue playing?";

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
    document.getElementById("end").innerHTML = "<h1 id=\"endMessage\" class=\"special\">You Lost!</h1> <a id=\"restartButton\" class= \"button\" onclick=\"startGame();\">Restart</a>"
    child = document.createElement('h2');
    child.innerText = "Your overall winnings were $" + maxMoney + ".";
    document.getElementById("end").insertChildAtIndex(child, 1);
}

function displayPlayerCards() {
    if (dealerCardsShown < 3) {
        dealerCardsShown++;
        dealerCards = document.getElementsByClassName("cards")[0];
        let newImage = document.createElement('img');
        newImage.src = "assets/images/cards/XX.png";
        dealerCards.appendChild(newImage);
        window.getComputedStyle(newImage).opacity;
        newImage.className += 'shown';
    } else {
        if (playerCardsShown == playerHand.length)
            alert("ERROR: Adding too many player Cards");
        cardWrapper = document.getElementsByClassName("cards")[1];
        card = playerHand[playerCardsShown++];

        var newImage = document.createElement('img');
        newImage.src = "assets/images/cards/" + card + ".png";
        cardWrapper.appendChild(newImage);
        window.getComputedStyle(newImage).opacity;
        newImage.className += 'shown';

        if (playerCardsShown == playerHand.length) {
            clearInterval(timer);
            timer = 0;

            // Show the other elements
            if (playerBalance >= anteBet)
                document.getElementById("playBet").innerText += " ($" + anteBet + ")";
            else {
                updatePlayerMessage("Not enough money to place play bet!");
                document.getElementById("buttonWrapper").innerHTML = "<a class=\"button secondary\" onclick=\"fold();\">Fold</a>";
            }
            setTimeout(function () {
                document.getElementById("buttonWrapper").style.opacity = 1;
            }, 200);
            document.getElementById("hash").innerHTML = hash;
            document.getElementById("hashWrapper").style.opacity = 1;
        }
    }
}

function displayDealerCards() {
    cardWrapper = document.getElementsByClassName("cards")[0];
    card = dealerHand[dealerCardsShown++];

    var newImage = document.createElement('img');
    newImage.src = "assets/images/cards/" + card + ".png";
    cardWrapper.appendChild(newImage);
    window.getComputedStyle(newImage).opacity;
    newImage.className += 'shown';

    if (dealerCardsShown == dealerHand.length) {
        clearInterval(timer);
        timer = 0;

        // Show the other elements
        continuePlay();
    }
}

function preloadPlayerImages() {
    let playerImages = 0;
    try {
        // Preload card back
        var _img = new Image();
        _img.src = "assets/images/cards/XX.png";

        // Preload player cards
        while (!(playerImages == playerHand.length)) {
            var _img = new Image();
            _img.src = "assets/images/cards/" + playerHand[playerImages++] + ".png";
        }
    } catch (e) {}
}

function preloadDealerImages() {
    let dealerImages = 0;
    try {
        // Preload dealer cards
        while (!(dealerImages == dealerHand.length)) {
            var _img = new Image();
            _img.src = "assets/images/cards/" + dealerHand[dealerImages++] + ".png";
        }
    } catch (e) {}
}

function updatePlayerMessage(message) {
    if (document.getElementById("resultMessage").innerText != "")
        document.getElementById("resultMessage").innerText += message;
    else
        document.getElementById("resultMessage").innerText = message;
    setTimeout(function () {
        document.getElementById("resultMessage").style.opacity = 1;
    }, 200);
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

function updateAnte() {
    isAnteValid = false;
    anteBet = parseInt(document.getElementById("anteInput").value);
    // Check for errors
    let error = document.getElementById("anteInputError");
    if (!anteBet) {
        error.innerHTML = "Please insert a valid number!";
        error.style.display = "block";
    } else if (anteBet < MIN_BET) {
        error.innerHTML = "Unable to bet less than the minimum!";
        error.style.display = "block";
    } else if (anteBet + ppBet > playerBalance) {
        error.innerHTML = "Unable to bet more than your available balance!";
        error.style.display = "block";
    } else {
        isAnteValid = true;
        error.innerHTML = '';
        error.style.display = "none";
    }
}

function updatePP() {
    isPPValid = false;
    ppBet = parseInt(document.getElementById("ppInput").value);
    // Check for errors
    let error = document.getElementById("ppInputError");
    if (!ppBet) {
        document.getElementById("ppInput").value = "";
        isPPValid = true;
        ppBet = 0;
        error.innerHTML = '';
        error.style.display = "none";
    } else if (ppBet < MIN_BET) {
        error.innerHTML = "Unable to bet less than the minimum!";
        error.style.display = "block";
    } else if (anteBet + ppBet > playerBalance) {
        error.innerHTML = "Unable to bet more than your available balance!";
        error.style.display = "block";
    } else {
        isPPValid = true;
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
    anteBet = 0;
    ppBet = 0;
    isAnteValid = false;
    isPPValid = false;
    playerHand = [];
    playerCardsShown = 0;
    playerAnteType = 0;
    playerPPType = 0;
    dealerHand = [];
    dealerCardsShown = 0;
    dealerPPType = 0;

    // Clear existing cards
    for (let i = 0; i < 2; i++)
        document.getElementsByClassName("cards")[i].innerHTML = "";
    document.getElementById("buttonWrapper").style.display = "flex";
    document.getElementById("endWrapper").style.opacity = 1;
    document.getElementById("endWrapper").style.display = "none";
    document.getElementById("resultMessage").innerText = "";
    document.getElementById("end").innerHTML = "<h1 id=\"endMessage\" class=\"special\">You Lost!</h1> <a id=\"restartButton\" class= \"button\" onclick=\"startGame();\">Restart</a>"
    document.getElementById("playBet").innerText = "Bet";
    document.getElementById("hash").innerHTML = "";
}

function enterDetector(e) {
    if (e.which == 13 || e.keyCode == 13) {
        this.blur();
    }
}

window.onload = function () {
    // Make enter deselect input
    document.getElementById('anteInput').addEventListener('keyup', enterDetector, false);
    document.getElementById('ppInput').addEventListener('keyup', enterDetector, false);
}

function updatePPType(inputHand) {
    if (isStraight(inputHand) && isFlush(inputHand))
        return STRAIGHT_FLUSH;
    else if (isThreeOfAKind(inputHand))
        return THREE_OF_A_KIND;
    else if (isStraight(inputHand))
        return STRAIGHT;
    else if (isFlush(inputHand))
        return FLUSH;
    else if (isPair(inputHand))
        return PAIR;
    else
        return HIGH_CARD;
}

function updateAnteType(inputHand) {
    if (isStraight(inputHand) && isFlush(inputHand))
        return ANTE_STRAIGHT_FLUSH;
    else if (isThreeOfAKind(inputHand))
        return ANTE_THREE_OF_A_KIND;
    else if (isStraight(inputHand))
        return ANTE_STRAIGHT;
    else
        return HIGH_CARD;
}

function isThreeOfAKind(inputHand) {
    if (getCardValue(inputHand[0]) == getCardValue(inputHand[1]) && getCardValue(inputHand[1]) == getCardValue(inputHand[2]))
        return true;
    return false
}

function isStraight(inputHand) {
    let max = Math.max(getCardValue(inputHand[0]), Math.max(getCardValue(inputHand[1]), getCardValue(inputHand[2])));
    let min = -Math.max(-getCardValue(inputHand[0]), Math.max(-getCardValue(inputHand[1]), -getCardValue(inputHand[2])));
    let mid = (getCardValue(inputHand[0]) + getCardValue(inputHand[1]) + getCardValue(inputHand[2])) - (max + min);

    if (max - mid == 1 && mid - min == 1)
        return true;
    else {
        let max = Math.max(getCardValueLowAce(inputHand[0]), Math.max(getCardValueLowAce(inputHand[1]), getCardValueLowAce(inputHand[2])));
        let min = -Math.max(-getCardValueLowAce(inputHand[0]), Math.max(-getCardValueLowAce(inputHand[1]), -getCardValueLowAce(inputHand[2])));
        let mid = (getCardValueLowAce(inputHand[0]) + getCardValueLowAce(inputHand[1]) + getCardValueLowAce(inputHand[2])) - (max + min);

        if (max - mid == 1 && mid - min == 1)
            return true;
    }
    return false;
}

function isFlush(inputHand) {
    if (inputHand[0].substring(inputHand[0].length - 1) == inputHand[1].substring(inputHand[1].length - 1) && inputHand[1].substring(inputHand[1].length - 1) == inputHand[2].substring(inputHand[2].length - 1))
        return true;
    return false
}

function isPair(inputHand) {
    for (let i = 0; i < inputHand.length; i++) {
        for (let j = 0; j < inputHand.length; j++) {
            if (i != j && getCardValue(inputHand[i]) == getCardValue(inputHand[j]))
                return true;
        }
    }
    return false;
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

function getHighestValue(hand) {
    let returnValue = 0;
    for (let i = 0; i < hand.length; i++) {
        if (getCardValue(hand[i]) > returnValue)
            returnValue = getCardValue(hand[i]);
    }
    return returnValue;
}

function updateHash(random) {
    for (var i = 0; i < 2; i++)
        hash += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    return random;
}

function getCardValue(card) {
    if (card.length == 3)
        return 10;

    let face = parseInt(card.substring(0, 1));
    if (face)
        return face;
    else {
        if (card.substring(0, 1) == "J")
            return 11;
        else if (card.substring(0, 1) == "Q")
            return 12;
        else if (card.substring(0, 1) == "K")
            return 13;
        else if (card.substring(0, 1) == "A")
            return 14;
    }
}

function getCardValueLowAce(card) {
    if (getCardValue(card) == 14)
        return 1;
    else
        return getCardValue(card);
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

// Taken from Stack Overflow
Element.prototype.insertChildAtIndex = function (child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
}