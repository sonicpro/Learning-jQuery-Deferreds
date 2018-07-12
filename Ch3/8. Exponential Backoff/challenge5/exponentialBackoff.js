// Function that attempts to call the function passed as the second argument nine times at most,
// and if none of the calls succeeds, returns the original failure value via the rejected promise.

// Nine calls is possible only if the error statuses are 500, 502 (Bad Gateway) or 504 (Gateway timeout). The checker function can be passed to retryingCaller as the third argument.

function retryingCaller ( /* context, function, checkerFunction, args... */ ) {
    var context = arguments[0],
        func = arguments[1],
        checkerFunction = arguments[2],
        args = $.makeArray(arguments).slice(3),
        deferred = $.Deferred(),
        rejectValue,
        delaysInSec = [0.0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 1.0, 2.0],
        attempt = 0,
        errorReasonHasCaptured = false,

        // This function is from Chapter 3 "setTimeout replacement" demo.
        wait = function(timeout) {
            return $.Deferred(function(d) {
                setTimeout(d.resolve, timeout);
            }).promise();
        },

        // This function will be called as the fail callback filter for each of the promises (nine at the most).
        error = function(value) {
            if (!errorReasonHasCaptured) {
                rejectValue = value;
                errorReasonHasCaptured = true;
            }

            if (attempt === delaysInSec.length || checkerFunction(value)) {
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
                    $.when(func.apply(context, [attempt].concat(args))).then(
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

function theFailingOne(attempt) {
    if (attempt < 9) {
        return $.Deferred().reject({ status: 500 });
    } else {
        return $.Deferred().reject({ status: 404 });
    }
}

function errorTester(error) {
    var allowedStatuses = [500, 502, 504];
    return $.inArray(error.status, allowedStatuses) === -1;
}

retryingCaller(null, theFailingOne, errorTester).fail(function(result) {
    console.log(result);
});

