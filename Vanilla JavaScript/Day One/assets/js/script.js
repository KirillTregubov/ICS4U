function onOver() {
    // x is an array
    var x = document.querySelectorAll(".c1");

    for (var i = 0; i < x.length; i++) {
        x[i].classList.add("hoverClass");
    }
}

function onOut() {
    // x is an array
    var x = document.querySelectorAll(".c1");

    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("hoverClass");
    }
}