// Function that attempts to call the function passed as the second argument nine times,
// and if none of the calls succeeds, returns the original failure value via the rejected promise.

function retryingCaller ( /* context, function, args... */ ) {
    var context = arguments[0],
        func = arguments[1],
        args = $.makeArray(arguments).slice(3),
        deferred = $.Deferred(),
        rejectValue,
        delaysInSec = $.isArray(arguments[2]) ? arguments[2] : [0.0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 1.0, 2.0],
        attempt = 0,

        // This function is from Chapter 3 "setTimeout replacement" demo.
        wait = function(timeout) {
            return $.Deferred(function(d) {
                setTimeout(d.resolve, timeout);
            }).promise();
        },

        // This function will be called as the fail callback filter for each of the promises (nine at the most).
        error = function(value) {
            if (rejectValue === undefined) {
                rejectValue = value;
            }

            if (attempt === delaysInSec.length) {
                deferred.reject(rejectValue);
            } else {
                call();
            }
        },

        // Notice that .done() runs the callback for the promise returned from wait(),
        // while $.when() constructs a new promise and filters it by means of .then() then.
        call = function() {
            wait(delaysInSec[attempt++] * 1000).done(
                function() {
                    // Calling $.when() with a single function argument is a way of converting
                    // the non-thenable argument function return value to the thenable one.                    
                    $.when(func.apply(context, args)).then(
                        deferred.resolve,
                        error
                    );
                }
            );
        };

    // Run the wait() callback for the first time. If it succeeds, we are done. If it fails,
    // make a recursive call unless attempts are exhausted.
    call();
    return deferred.promise();
}

// function theFailingOne() {
//     return $.Deferred().reject("I'm failing");
// }

function theSucceedingOne() {
    return "Success";
}

retryingCaller(null, theFailingOne, [ 1, 5, 10 ]).fail(function(result) {
    console.log(result);
});

// retryingCaller(null, theSucceedingOne, [ 1, 5, 10 ]).done(function(result) {
//     console.log(result);
// });
