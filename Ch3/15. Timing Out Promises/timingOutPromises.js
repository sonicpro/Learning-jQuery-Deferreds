/*global setTimeout */

// "deactivatingWait" function returns an array with two values - the promise and the callback function to increase counter.
// The returned promise is rejected if the timeout passed to "deactivatingWait" has reached before the internal counter reaches passed "triggerCount".
function deactivatingWait(timeout, triggerCount) {
    var deferred = $.Deferred(),
        count = 0,
        increaseCompletedTaskCount = function () {
            if (++count === triggerCount) {
                deferred.resolve();
            }
        };

    // We do not save timeoutId for the sake of brievity. It does not matter if the timeout fires after the "count" reaches
    // "triggerCount".
    setTimeout(deferred.reject, timeout);
    return [deferred.promise(), increaseCompletedTaskCount];
}

// Combine the above function with the $.wait2 jQuery extension.
// The first argument is the timeout in milliseconds, the second is the array of promises returned by the tasks we are going to execute
// in timeout fashion. The returned value is the array of results on case all the tasks succeeded and the array containing the index
// of the timeouted / failed tasks at the index 0 and the error reason at the index 1.
function when2WithTimeout(timeout, promises) {
    var timeoutPromiseAndIncreaseCounterCallback = deactivatingWait(timeout, promises.length),
        timeoutPromise = timeoutPromiseAndIncreaseCounterCallback[0],
        increaseCounterFunc = timeoutPromiseAndIncreaseCounterCallback[1];

    for (var i = 0; i < promises.length; i++) {
        promises[i].done(increaseCounterFunc);
    }

    // When omitted the second "options" agrument, $.when2() behaviour is "reject on the first failure".
    // We also do some result conversion in .then() filtering callbacks.
    return $.when2([timeoutPromise].concat(promises)).then(
        function() {
            // Drop the "undefined" result of the resolved promise returned by deactivatingWait().
            return Array.prototype.slice.call(arguments, 1);
        },
        function(index, error) {
            // Asjust the index to match passed to when2WithTimeout() promises array.
            return [index - 1, error];
        });
}

function executingImmediately() {
    return $.Deferred().resolve(1);
}

function executingInThreeSeconds() {
    var def = $.Deferred();
    setTimeout(def.resolve.bind(def, 2), 3000);
    return def.promise();
}

// Set timeout to two seconds - the batch is bound to fail.
when2WithTimeout(2000, [executingImmediately(), executingInThreeSeconds()])
        .done(function (results) {
            console.log(results);
        })
        .fail(function (result) {
            var index = result[0];
            if (index === -1) {
                console.log("Timeout!");
            } else {
                console.log("Error: " + result[1]);
            }
        });



// Set timeout to four seconds - the batch succeeds.
when2WithTimeout(4000, [executingImmediately(), executingInThreeSeconds()])
        .done(function (results) {
            console.log(results);
        })
        .fail(function (result) {
            var index = result[0];
            if (index === -1) {
                console.log("Timeout!");
            } else {
                console.log("Error: " + result[1]);
            }
        });
