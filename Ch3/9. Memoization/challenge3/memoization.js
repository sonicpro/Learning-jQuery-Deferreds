/*global $ */
// This function takes a function and return that function wrapped so that it gets memoized.
function memoize(func) {
    var promises = {};

    // Arbitrary number of arguments supported.
    return function() {
        var key = "";
        for (var idx in arguments) {
            var arg = arguments[idx];
            if ($.isPlainObject(arg) || $.isArray(arg)) {
                key = key + JSON.stringify(arg);
            } else {
                key = key + arg;
            }
        }
        
        if (!promises.hasOwnProperty(key)) {
            // If func does not return promise, call to $.when guarantees that the return value is converted to promise.
            promises[key] = $.when(func.apply(null, arguments)).promise();
        }

        return promises[key];
    };
}

function takesTwoInts(val1, val2) {
    console.log("takesTwoInts is called");
    return val1 + val2;
}

function takesIntAndObject(val, ref) {
    console.log("takesIntAndObject is called");
    return $.Deferred().resolve(val + ref.val);
}


var takesTwoIntsMem = memoize(takesTwoInts),
    takesIntAndObjectMem = memoize(takesIntAndObject);

for(var i = 0; i != 3; i++) {
    takesTwoIntsMem(1, 1).done(function(res) {
        console.log("The sum is " + res);
    });
    takesIntAndObjectMem(2, { val: 2 }).done(function(res) {
        console.log("The sum is " + res);
    });
}
