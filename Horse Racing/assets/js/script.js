$.getScript("assets/js/animateSprite.js", function () {});
$.getScript("assets/js/interact.js", function () {});

$(document).ready(function () {
    $('.preloader-wrapper').fadeOut();
    $('#welcome').removeClass("hidden");
});

// Variables
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_BALANCE = 500;
const DEFAULT_HORSES = ["A", "B", "C", "D", "E", "F", "G", "H"];
var origin;
var isNameValid;
var players;
var currentPlayer;
var currentHorses;
var currentBets;
var maxPosition;
var winningHorse;
var horseTime = false;
var moneyTime = false;
var oddsTime = false;

// Onclick buttons
$('#restartButton').click(function () {
    initializeGame();
});

$('#creditButton').click(function () {
    if ($(this).hasClass("credits")) {
        $("section").each(function () {
            if (!$(this).hasClass("hidden") && $(this).attr("id") != "credits") {
                origin = $(this).attr("id");
            }
        });
        $(this).removeClass("credits").html("Return");
        transition(origin, "credits");
    } else {
        $("section").each(function () {
            if (!$(this).hasClass("hidden") && $(this).attr("id") != "credits") {
                origin = $(this).attr("id");
            }
        });
        $(this).addClass("credits").html("Credits");
        transition("credits", origin);
    }
});

$('#returnButton').click(function () {
    $("section").each(function () {
        if (!$(this).hasClass("hidden") && $(this).attr("id") != "credits") {
            origin = $(this).attr("id");
        }
    });
    $("#creditButton").addClass("credits").html("Credits");
    transition("credits", origin);
});

$('#startPlaying').click(function () {
    initializeGame();
});

$('#addPlayer').click(function () {
    transition("players", "add");
});

$('#addPlayerTwo').click(function () {
    transition("players", "add");
});

$('#startRound').click(function () {
    transition("players", "betting");
});

$('#betButton').click(function () {
    toggleBets();
});

function initializeGame() {
    $("section").each(function () {
        if (!$(this).hasClass("hidden") && $(this).attr("id") != "players") {
            origin = $(this).attr("id");
        }
    });

    players = [];
    $("#playerAmount").html(players.length);
    $("#creditButton").addClass("credits").html("Credits");
    $("#nav").find(".hidden").removeClass("hidden").animate({
        opacity: 1
    }, 300);
    initializeRound();
    transition(origin, "players");
}

function initializeRound() {
    // Reset Values
    currentPlayer = 0;
    currentBets = [];
    maxPosition = 0;
    winningHorse = 0;
    horseTime = false;
    moneyTime = false;
    oddsTime = false;


    // Methods
    shuffle(DEFAULT_HORSES);
    currentHorses = DEFAULT_HORSES.slice(0, 6);
    stopListeners();
    $("#play").find("h2").addClass("hidden").removeClass("attention");
    $("#playerList").find("tbody").html('<tr class="hidden"></tr>');
    $("#winnerList").find("tbody").html('<tr class="hidden"></tr>');
    $("#betList").find("tbody").html('<tr class="hidden"></tr>');
    $("#race").html('<div class="hidden"></div>');
    $("#play").find(".button:last").off("click").on("click", function () {
        startRace();
    }).html("Start Race");
    $("#end").find(".button:last").off("click").on("click", function () {
        transition("end", "players");
    }).html("Continue to Next Round");
    $("#startRound")
    $("#dropOrigin").html('<div id="draggableBill" class="hidden" draggable="true"></div>');
    players.forEach(function (element) {
        $('#playerList tr:last').after('<tr name="' + element.name + '"><td>' + element.name + '</td><td>' + element.balance + '</td><td class="hasButton"><a class="button destructive" onclick="removePlayer(\'' + element.name + '\')">remove</a></td></tr>');
    });
}

function play() {
    currentBets.forEach(function (element) {
        $('#betList tr:last').after('<tr><td>' + players[parseInt(element.player)].name + '</td><td>' + element.amount + '</td><td>' + element.horse + '</td><td>' + element.odds + '</td></tr>');
    });
    currentHorses.forEach(function (element) {
        $('#race div:last').after('<div id="' + element + '" class="horse"></div>');
    });
}

function addPlayer() {
    updateName();
    if (isNameValid) {
        let name = $("#nameInput").val().substr(0, 1).toUpperCase() + $("#nameInput").val().substr(1);
        players.push({
            name: name,
            balance: DEFAULT_BALANCE
        });
        $('#playerList tr:last').after('<tr><td>' + players[players.length - 1].name + '</td><td>' + players[players.length - 1].balance + '</td><td class="hasButton"><a class="button destructive">remove</a></td></tr>');
        $("#playerAmount").fadeOut().fadeIn().html(players.length);
        transition("add", "players");
        $("#nameInput").val("");
    }
}

function removePlayer(name) {
    if (players.getContaining(name)) {
        players.pop(players.getContaining(name));
        if (players.length < 1) {
            $("#players").fadeOut();
            setTimeout(function () {
                $("#playerList").find("tbody").html('<tr class="hidden"></tr>');
                $("#noPlayerWarning").removeClass("hidden");
                $("#playerList").addClass("hidden");
                fixPlayers();
                $("#players").fadeIn();
            }, 400);
        } else {
            $('#playerList [name="' + name + '"]').animate({
                opacity: 0
            }, 300)
            setTimeout(function () {
                $('#playerList [name="' + name + '"]').addClass("hidden");
            }, 300);
        }
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

function fixPlayers() {
    if (players.length > 0) {
        $("#playerList").removeClass("hidden");
        $("#noPlayerWarning").addClass("hidden");
        $("#addPlayer").addClass("hidden");
        $("#players").find(".buttonWrapper").removeClass("hidden");
    } else {
        $("#addPlayer").removeClass("hidden");
        $("#players").find(".buttonWrapper").addClass("hidden");
    }
}

function continueBettingButton() {
    currentPlayer++;
    $("#betting").animate({
        opacity: 0
    }, 300);
    continueBetting();
    $("#betting").animate({
        opacity: 1
    }, 300);
}

function continueBetting() {
    setTimeout(function () {
        $("#hash").html(updateHash());
        $("#hashWrapper").animate({
            opacity: 1
        }, 300);

        $("#notEnoughMoney").addClass("hidden");
        $("#dropOrigin").html('<div id="draggableBill" class="hidden" draggable="true"></div>');

        // Fix button
        if (players.length - 1 > currentPlayer) $("#betting").find(".continueButton").off("click").on("click", function () {
            continueBettingButton();
        }).html("Continue to Next Player");
        else $("#betting").find(".continueButton").removeClass("secondary").addClass("disabled").off("click").html("Continue to Game");

        // Set horses
        $(".selectWrapper").eq(0).html('<span class="placeholder placeholderMoney">choose amount</span><ul id="selectMoney" class="select"><li id="placeholderMoney"><a href="">choose amount</a></li><li name="5"><a href="">5</a></li><li name="10"><a href="">10</a></li><li name="20"><a href="">20</a></li><li name="50"><a href="">50</a></li><li name="100"><a href="">100</a></li></ul>')
        $(".selectWrapper").eq(1).html('<span class="placeholder placeholderHorse">choose a horse</span><ul id="selectHorse" class="select"><li id="placeholderHorse"><a href="">choose a horse</a></li></ul>');
        $(".selectWrapper").eq(2).html('<span class="placeholder placeholderOdds">choose odds</span><ul id="selectOdds" class="select"><li id="placeholderOdds"><a href="">choose amount</a></li><li value="win"><a href="">win</a></li><li value="place"><a href="">place</a></li><li value="show"><a href="">show</a></li></ul>')
        currentHorses.forEach(function (element) {
            $('#selectHorse li:last').after('<li name="' + element + '"><a href="">' + element + '</a></li>');
        });
        
        // Listeners
        $('.placeholderMoney').on('click', function () {
            $('.placeholderMoney').css('opacity', '0');
            $('#selectMoney').toggle();
        });
        $('.placeholderHorse').on('click', function () {
            $('.placeholderHorse').css('opacity', '0');
            $('#selectHorse').toggle();
        });
        $('.placeholderOdds').on('click', function () {
            $('.placeholderOdds').css('opacity', '0');
            $('#selectOdds').toggle();
        });
        $('#selectMoney li').on('click', moneyListener);
        $('#selectHorse li').on('click', horseListener);
        $('#selectOdds li').on('click', oddsListener);

        //Update Player
        $("#insertPlayer").html(players[currentPlayer].name);
        $("#playerBalance").html("$" + players[currentPlayer].balance);
    }, 300);
}

function startRound() {
    transition("betting", "play");
}

function startRace() {
    $("#play").find(".button:last").addClass("disabled").off("click").html("See Results");
    animateRace();
}

function animateRace() {
    setTimeout(function () {
        $(".horse").animateSprite({
            fps: 13,
            animations: {
                run: [1, 2, 3, 4, 5, 6]
            },
            autoplay: false,
            loop: true
        });
        $('.horse').animateSprite('play', 'run');
        $(".horse").each(function () {
            var newInt = Math.floor(Math.random() * 10) + 1;

            if (parseInt($(this).css('margin-left')) + newInt > 500)
                newInt = 500 - parseInt($(this).css('margin-left'));

            $(this).animate({
                marginLeft: "+=" + newInt + "px",
            }, 50);
            //$(this).css('margin-left', '+=' + newInt);
            if (parseInt($(this).css('margin-left')) > maxPosition) {
                maxPosition = parseInt($(this).css('margin-left'));
                winningHorse = $(this);
            }
        });
        if (maxPosition < 500) { // If i > 0, keep going
            animateRace(); // Call the loop again, and pass it the current value of i
        } else {
            $('.horse').animateSprite("stop").css("background-position", "0px -60.75px");
            $(winningHorse).addClass("winner");
            $("#winnerHorse").html(winningHorse.attr("id")).parent().removeClass("hidden").addClass("attention");
            $("#play").find(".button:last").fadeOut().fadeIn().off("click").on("click", function () {
                openResults();
            }).removeClass("disabled");
        }
    }, 300);
};

function toggleBets() {
    if ($("#betList").toggleClass("hidden").hasClass("hidden")) {
        $("#play").find(".button:first").html("reveal");
        $("#race").removeClass("hidden");
    } else {
        $("#play").find(".button:first").html("hide");
        $("#race").addClass("hidden");
    }
}

function openResults() {
    if (players.cantContinue()) {
        $("#end").find(".button:last").off("click").on("click", function () {
            initializeGame();
        }).html("Restart Game");
    } else {
        currentBets.forEach(function (element) {
            let amount;
            if (element.horse == $(winningHorse).attr("id")) {
                let multiplier;
                if (element.odds == "win") {
                    multiplier = 2;
                } else if (element.odds == "place") {
                    multiplier = 1.75;
                } else if (element.odds == "show") {
                    multiplier = 1.5;
                }
                amount = "$" + element.amount * (multiplier - 1);
                players[parseInt(element.player)].balance += parseInt(element.amount) * multiplier;
            } else {
                amount = "-$" + element.amount;
            }
            $('#winnerList tr:last').after('<tr><td>' + players[parseInt(element.player)].name + '</td><td>' + amount + '</td></tr>');
        });

        transition("play", "end");
    }
}

function updateHash() {
    let hash = "";
    for (var i = 0; i < 10; i++)
        hash += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    return hash;
}

function transition(currentId, nextId) {
    // Exceptions
    if (nextId == "betting") {
        continueBetting();
    } else if (nextId == "play") {
        play();
    } else if (nextId == "add") {
        $('#addPlayerButton').off("click").on("click", function () {
            addPlayer();
        });
    }

    // Regular Behaviour
    $("#" + currentId).animate({
        opacity: 0
    }, 600);
    setTimeout(function () {
        $("#" + currentId).addClass("hidden");

        // More Exceptions
        if (nextId == "players") {
            initializeRound();
            fixPlayers();
        }

        $("#" + nextId).css("opacity", 0).removeClass("hidden").animate({
            opacity: 1
        }, 600);
        if ($("#" + currentId).hasClass("hasFooter") && $("footer").hasClass("hidden")) {
            $("footer").css("opacity", "0").removeClass("hidden").animate({
                opacity: 1
            }, 600);
        }

        // End Exceptions
        if (nextId == "players" && players.length < 1) {
            $("#noPlayerWarning").removeClass("hidden");
        }
    }, 600);
}

function horseListener(ev) {
    ev.preventDefault();
    var index = $(this).index();
    if (!horseTime && !$(this).text().includes("choose")) {
        $("#placeholderHorse").addClass("hidden");
        horseTime = true;
        if (moneyTime && horseTime && oddsTime)
            startListeners();
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
        if (moneyTime && horseTime && oddsTime)
            startListeners();
    }

    $("#draggableBill").attr("value", $(this).attr("name")).css("opacity", "0").removeClass("hidden").animate({
        opacity: 1
    }, 200);
    $('.placeholderMoney').text($(this).text()).css('opacity', '1');
    $('#selectMoney').find('li').eq(index).prependTo('#selectMoney');
    $('#selectMoney').toggle();
}

function oddsListener(ev) {
    ev.preventDefault();
    var index = $(this).index();
    if (!oddsTime && !$(this).text().includes("choose")) {
        $("#placeholderOdds").addClass("hidden");
        oddsTime = true;
        if (moneyTime && horseTime && oddsTime)
            startListeners();
    }

    $('.placeholderOdds').text($(this).text()).css('opacity', '1');
    $('#selectOdds').find('li').eq(index).prependTo('#selectOdds');
    $('#selectOdds').toggle();
}

function startListeners() {
    $("#dropTarget").on('dragover', dragOver).on('dragenter', dragEnter).on('dragleave', dragLeave).on('drop', dragDrop);
}

function stopListeners() {
    $("#dropTarget").off('dragover', dragOver).off('dragenter', dragEnter).off('dragleave', dragLeave).off('drop', dragDrop);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    $(this).addClass("hovered");
}

function dragLeave() {
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
            $("#betting").find(".continueButton").removeClass("disabled").on("click", function () {
                startRound();
            });
            players[currentPlayer].balance -= parseInt($("#draggableBill").attr("value"));
            if (currentBets.isSimilarTo(currentPlayer, $('#selectHorse li:first').attr("name"))) {
                currentBets[currentBets.isSimilarTo(currentPlayer, $('#selectHorse li:first').attr("name"))].amount += parseInt($("#draggableBill").attr("value"));
            } else {
                currentBets.push({
                    player: currentPlayer,
                    amount: parseInt($("#draggableBill").attr("value")),
                    horse: $('#selectHorse li:first').attr("name"),
                    odds: $('#selectOdds li:first').attr("value")
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

Array.prototype.getContaining = function (name) {
    for (i in this) {
        if (this[i].name == name) return i;
    }
    return false;
}

Array.prototype.cantContinue = function () {
    for (i in this) {
        if (this[i].balance > 0) return false;
    }
    return true;
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