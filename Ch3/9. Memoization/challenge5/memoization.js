// This function takes a function and return that function wrapped so that it gets memoized.
// This is "stict" variation of the original "memoize" function. This function returns a function
// that returns promise only if the memoized function returned promise as well.
function memoize(func) {
    // For any given function the results object will contain either promises or the results keyed with the argument value.
    // Only single-argument function memoization is supported in this demo. For multiple argument function memoization see the challenge3.
    var results = {};

    return function(arg) {
        if (!results.hasOwnProperty(arg)) {
            var retVal = func(arg);
            
            // this is the same check that uses $.when
            if ($.isFunction(retVal.promise)) {
                results[arg] = retVal.promise();
            } else {
                results[arg] = retVal;
            }
        }
        return results[arg];        
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
    console.log(simpleMem());

    asyncMem().done(function(res) {
        console.log("async result is " + res);
    });
}
