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

function updateBet() {
    var bet = document.getElementById("betInput").value;

    document.getElementById("bet").innerHTML = bet;
    document.querySelectorAll("body")[0].append('<p>hi</p>');
}