$.getScript("assets/js/animateSprite.js", function () {});
$.getScript("assets/js/interact.js", function () {});

$(document).ready(function () {
    $('.preloader-wrapper').fadeOut();
    $('#players').removeClass("hidden");
    initializeGame();
    $(".horse").animateSprite({
        animations: {
            walkRight: [1, 2, 3, 4, 5, 6]
        },
        autoplay: false,
    });

    // Custom Selector
    $('.placeholderMoney').on('click', function () {
        $('.placeholderMoney').css('opacity', '0');
        $('.selectMoney').toggle();
    });

    $('.placeholderHorse').on('click', function () {
        $('.placeholderHorse').css('opacity', '0');
        $('.selectHorse').toggle();
    });

    $('.selectMoney a').on('click', function (ev) {
        ev.preventDefault();
        var index = $(this).parent().index();

        $('.placeholderMoney').text($(this).text()).css('opacity', '1');
        $('.selectMoney').find('li').eq(index).prependTo('.selectMoney');
        $('.selectMoney').toggle();

    });

    $('.selectHorse a').on('click', function (ev) {
        ev.preventDefault();
        var index = $(this).parent().index();

        $('.placeholderHorse').text($(this).text()).css('opacity', '1');
        $('.selectHorse').find('li').eq(index).prependTo('.selectHorse');
        $('.selectHorse').toggle();

    });
});

const fill = document.querySelector('.fill');
const banks = document.querySelectorAll('.bank');

// Fill listeners
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

// Loop through empty boxes and add listeners
for (const bank of banks) {
    bank.addEventListener('dragover', dragOver);
    bank.addEventListener('dragenter', dragEnter);
    bank.addEventListener('dragleave', dragLeave);
    bank.addEventListener('drop', dragDrop);
}

// Drag Functions

function dragStart() {
    // start, remove money from bank?
    this.className += ' hold';
    setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
    // applies style when finished, check if in bank and deduct
    this.className = 'fill';
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.className += ' hovered';
}

function dragLeave() {
    this.className = 'bank';
}

function dragDrop() {
    this.className = 'bank';
    this.append(fill);
    console.log("dropped");
}

// Variables
const DEFAULT_BALANCE = 500;
const DEFAULT_HORSES = ["A", "B", "C", "D"];
var isNameValid;
var players;
var currentHorses = [];
var currentBets = [];

function initializeGame() {
    players = [];
    initializeRound();
    transition("welcome", "players");
}

function initializeRound() {
    shuffle(DEFAULT_HORSES);
    currentHorses = DEFAULT_HORSES.slice(0, 6);
    currentBets = {};
}

function continueBetting() {
    // make another plaeyr ebt
}

function startRound() {
    // start horse race
}

function addPlayer() {
    updateName();
    if (isNameValid) {
        players.push({
            name: $("#nameInput").val(),
            balance: DEFAULT_BALANCE
        });
        $('#playerList tr:last').after('<tr><td>' + players[players.length - 1].name + '</td><td>' + players[players.length - 1].balance + '</td><td><a class="button destructive">remove</a></td></tr>');
    }
    transition("add", "players");
    $("#nameInput").val("");
}

function updateName() {
    // Check for errors
    let error = $("#nameInputError");
    if (!$("#nameInput").val()) {
        error.html("Please input a valid name!");
        error.css("display", "block");
    } else {
        isNameValid = true;
        error.html();
        error.css("display", "none");
    }
}

function reset() {

}

function transition(currentId, nextId) {
    // Start Exceptions
    if (nextId == "players") {
        if (players.length > 0) {
            $("#playerList").removeClass("hidden");
            $("#noPlayerWarning").addClass("hidden");
            $("#players").find(".addPlayer").addClass("hidden");
            $("#players").find(".buttonWrapper").removeClass("hidden");
        } else {
            $("#players").find(".addPlayer").removeClass("hidden");
            $("#players").find(".buttonWrapper").addClass("hidden");
        }
    } else if (nextId == "betting") {
        if (players.length > 1) $("#players").find(".continueButton").attr("onclick", "continueBetting()").html("Continue to Next Player");
        else $("#players").find(".continueButton").attr("onclick", "startRound()").html("Continue to Game");
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