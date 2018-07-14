// This function takes a function and return that function wrapped so that it gets memoized.
function memoize(func) {
    var promises = {};

    return function(arg) {
        if (!promises.hasOwnProperty(arg)) {
            // If func does not return promise, call to $.when guarantees that the return value is converted to promise.
            promises[arg] = $.when(func(arg)).promise();
        }

        return promises[arg];
    };
}

function simple() {
    console.log("simple is called");
    return 1;
}

function async() {
    console.log("async is called");
    return $.Deferred().resolve(2);
}


var simpleMem = memoize(simple),
    asyncMem = memoize(async);

for(var i = 0; i != 3; i++) {
    simpleMem().done(function(res) {
        console.log("simple result is " + res);
    });
    asyncMem().done(function(res) {
        console.log("async result is " + res);
    });
}
