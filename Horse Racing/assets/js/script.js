$.getScript("assets/js/animateSprite.js", function () { });
$.getScript("assets/js/interact.js", function () { });

$(document).ready(function () {
    $('.preloader-wrapper').fadeOut();

    initializeRound();
    players = [{ name: "aa", balance: "500" }, { name: "bb", balance: "500" }];
    $("#playerAmount").html(players.length);
    currentBets = [{ player: 0, amount: 50, horse: "F" }, { player: 1, amount: 20, horse: "B" }];
    transition('play', 'play');
    //initializeGame();

    $(".horse").animateSprite({
        fps: 13,
        animations: {
            run: [1, 2, 3, 4, 5, 6]
        },
        autoplay: false,
        loop: true
    });
});

// Variables
const DEFAULT_BALANCE = 500;
const DEFAULT_HORSES = ["A", "B", "C", "D", "E", "F", "G", "H"];
var origin;
var isNameValid;
var players;
var currentPlayer;
var currentHorses;
var currentBets;
var maxPosition;
var moneyTime = false;
var horseTime = false;

function initializeGame() {
    $("#creditsLink").html('<a onclick="openCredits();">Credits</a>');
    $("section").each(function () {
        if (!$(this).hasClass("hidden") && $(this).attr("id") != "players") {
            origin = $(this).attr("id");
        }
    });
    players = [];
    $("#playerAmount").html(players.length);
    initializeRound();
    transition(origin, "players");
}

function initializeRound() {
    currentPlayer = 0;
    currentBets = [];
    maxPosition = 0;
    shuffle(DEFAULT_HORSES);
    currentHorses = DEFAULT_HORSES.slice(0, 6);
}

function fixPlayers() {
    if (players.length > 0) {
        $("#playerList").removeClass("hidden");
        $("#noPlayerWarning").addClass("hidden");
        $("#players").find(".addPlayer").addClass("hidden");
        $("#players").find(".buttonWrapper").removeClass("hidden");
    } else {
        $("#players").find(".addPlayer").removeClass("hidden");
        $("#players").find(".buttonWrapper").addClass("hidden");
    }
}

function continueBettingButton() {
    currentPlayer++;
    continueBetting();
}

function continueBetting() {
    $("#betting").animate({
        opacity: 0
    }, 300);
    setTimeout(function () {
        $("#notEnoughMoney").addClass("hidden");

        // Fix button
        if (players.length - 1 > currentPlayer) $("#betting").find(".continueButton").attr("onclick", "continueBettingButton()").html("Continue to Next Player");
        else $("#betting").find(".continueButton").removeClass("secondary").attr("onclick", "startRound()").html("Continue to Game");

        // Set horses
        $(".selectWrapper").eq(1).html('<span class="placeholder placeholderHorse">choose a horse</span><ul id="selectHorse" class="select"><li id="placeholderHorse"><a href="">choose a horse</a></li></ul>');
        currentHorses.forEach(function (element) {
            $('#selectHorse li:last').after('<li name="' + element + '"><a href="">' + element + '</a></li>');
        });
        $(".selectWrapper").eq(0).html('<span class="placeholder placeholderMoney">choose amount</span><ul id="selectMoney" class="select"><li id="placeholderMoney"><a href="">choose amount</a></li><li name="5"><a href="">5</a></li><li name="10"><a href="">10</a></li><li name="20"><a href="">20</a></li><li name="50"><a href="">50</a></li><li name="100"><a href="">100</a></li></ul>')

        // Listeners
        $('.placeholderMoney').on('click', function () {
            $('.placeholderMoney').css('opacity', '0');
            $('#selectMoney').toggle();
        });

        $('.placeholderHorse').on('click', function () {
            $('.placeholderHorse').css('opacity', '0');
            $('#selectHorse').toggle();
        });
        $('#selectMoney li').on('click', moneyListener);
        $('#selectHorse li').on('click', horseListener);

        //Update Player
        $("#insertPlayer").html(players[currentPlayer].name);
        $("#playerBalance").html("$" + players[currentPlayer].balance);
        $("#betting").animate({
            opacity: 1
        }, 300);
    }, 300);
}

function startRound() {
    console.log("start round");
    transition("betting", "play");
}

function startRace() {
    console.log("animate");
    animateRace();
}

function animateRace() {
    setTimeout(function () {
        //console.log("loop");
        $('.horse').animateSprite('play', 'run');
        $(".horse").each(function () {
            var newInt = Math.floor(Math.random() * 3) + 1;
            $(this).css('margin-left', '+=' + newInt);
            if (parseInt($(this).css('margin-left')) > maxPosition) maxPosition = parseInt($(this).css('margin-left'));
        });
        if (maxPosition < 500) {          // If i > 0, keep going
            animateRace();       // Call the loop again, and pass it the current value of i
        } else {

            $('.horse').animateSprite("stop").css("background-position", "0px -60.75px");
        }
    }, 400);
};

function toggleBets() {
    if ($("#betList").toggleClass("hidden").hasClass("hidden")) {
        $("#race").removeClass("hidden");
    } else {
        $("#race").addClass("hidden");
    }
}

function play() {
    currentBets.forEach(function (element) {
        console.log(element.player);
        $('#betList tr:last').after('<tr><td>' + players[parseInt(element.player)].name + '</td><td>' + element.amount + '</td><td>' + element.horse + '</td><td><a class="button destructive">remove</a></td></tr>');
    });
    currentHorses.forEach(function (element) {
        $('#race div:last').after('<div id="' + element + '" class="horse"></div>');
    });
}

function addPlayer() {
    updateName();
    if (isNameValid) {
        players.push({
            name: $("#nameInput").val(),
            balance: DEFAULT_BALANCE
        });
        $('#playerList tr:last').after('<tr><td>' + players[players.length - 1].name + '</td><td>' + players[players.length - 1].balance + '</td><td><a class="button destructive">remove</a></td></tr>');
        $("#playerAmount").fadeOut().fadeIn().html(players.length);
        transition("add", "players");
        $("#nameInput").val("");
    }
}

function updateName() {
    // Check for errors
    let error = $("#nameInputError");
    if (!$("#nameInput").val()) {
        isNameValid = false;
        error.html("Please input a valid name!");
        error.css("display", "block");
    } else if (players.contains($("#nameInput").val())) {
        isNameValid = false;
        error.html("Please input a unique name!");
        error.css("display", "block");
    } else {
        isNameValid = true;
        error.html();
        error.css("display", "none");
    }
}

function transition(currentId, nextId) {
    // Start Exceptions
    if (nextId == "players") {
        fixPlayers();
    } else if (nextId == "betting") {
        continueBetting();
    } else if (nextId == "play") {
        play();
    }

    // Regular Behaviour
    $("#" + currentId).animate({
        opacity: 0
    }, 600);
    setTimeout(function () {
        $("#" + currentId).addClass("hidden");
        $("#" + nextId).css("opacity", 0).removeClass("hidden").animate({
            opacity: 1
        }, 600);

        // End Exceptions
        if (nextId == "players" && players.length < 1) {
            $("#noPlayerWarning").removeClass("hidden");
        }
    }, 600);
}

/* TODO
function updateHash(random) {
    for (var i = 0; i < 2; i++)
        hash += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    return random;
}
*/

function openCredits() {
    $("section").each(function () {
        if (!$(this).hasClass("hidden") && $(this).attr("id") != "credits") {
            origin = $(this).attr("id");
        }
    });
    transition(origin, "credits");
    $("#creditsLink").html('<a onclick="goBack();">Return</a>');
}

function goBack() {
    $("section").each(function () {
        if (!$(this).hasClass("hidden") && $(this).attr("id") != "credits") {
            origin = $(this).attr("id");
        }
    });
    $("#creditsLink").html('<a onclick="openCredits();">Credits</a>');
    transition("credits", origin);
}

function horseListener(ev) {
    ev.preventDefault();
    var index = $(this).index();
    if (!horseTime && !$(this).text().includes("choose")) {
        $("#placeholderHorse").addClass("hidden");
        startListeners();
        horseTime = true;
    }

    $('.placeholderHorse').text($(this).text()).css('opacity', '1');
    $('#selectHorse').find('li').eq(index).prependTo('#selectHorse');
    $('#selectHorse').toggle();
}

function moneyListener(ev) {
    ev.preventDefault();
    var index = $(this).index();
    if (!moneyTime && !$(this).text().includes("choose")) {
        $("#placeholderMoney").addClass("hidden");
        moneyTime = true;
    }

    $("#draggableBill").attr("value", $(this).attr("name")).css("opacity", "0").removeClass("hidden").animate({
        opacity: 1
    }, 200);
    $('.placeholderMoney').text($(this).text()).css('opacity', '1');
    $('#selectMoney').find('li').eq(index).prependTo('#selectMoney');
    $('#selectMoney').toggle();
}

function startListeners() {
    $("#dropTarget").on('dragover', dragOver).on('dragenter', dragEnter).on('dragleave', dragLeave).on('drop', dragDrop);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    console.log("enter");
    $(this).addClass("hovered");
}

function dragLeave() {
    console.log("leave");
    $(this).removeClass("hovered");
}

function dragDrop() {
    $("#notEnoughMoney").addClass("hidden");
    $(this).removeClass("hovered");
    $("#draggableBill").removeClass();
    $(this).append($("#draggableBill"));
    setTimeout(function () {
        $("#draggableBill").fadeOut();
        if (players[currentPlayer].balance < parseInt($("#draggableBill").attr("value"))) {
            $("#notEnoughMoney").removeClass("hidden");
        } else {
            players[currentPlayer].balance -= parseInt($("#draggableBill").attr("value"));
            if (currentBets.isSimilarTo(currentPlayer, $('#selectHorse li:first').attr("name"))) {
                currentBets[currentBets.isSimilarTo(currentPlayer, $('#selectHorse li:first').attr("name"))].amount += parseInt($("#draggableBill").attr("value"));
            } else {
                currentBets.push({
                    player: currentPlayer,
                    amount: parseInt($("#draggableBill").attr("value")),
                    horse: $('#selectHorse li:first').attr("name")
                });
            }
            $("#playerBalance").fadeOut().fadeIn().html("$" + players[currentPlayer].balance);
        }
        setTimeout(function () {
            $("#dropOrigin").append($("#draggableBill").fadeIn());
        }, 400);
    }, 200);
}


Array.prototype.contains = function (name) {
    for (i in this) {
        if (this[i].name == name) return true;
    }
    return false;
}

Array.prototype.isSimilarTo = function (player, horse) {
    for (i in this) {
        if (this[i].player == player && this[i].horse == horse) return i;
    }
    return false;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}