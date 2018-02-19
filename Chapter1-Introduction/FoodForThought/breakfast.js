// The goal is to run makeToast() and makeEggs() functions in parallel,
// as soon as they both finish, call the callback.

function makeBreakfast(callback) {
    var completionFlags = {};

    setTimeout(function() {
        completionFlags.makeToast = false;
        completionFlags.makeToast = makeToast();
    }, 0);

    setTimeout(function() {
        completionFlags.makeEggs = false;
        completionFlags.makeEggs = makeEggs();
    }, 0);

    // Polling for both the above functions completion.
    var monitorId = setInterval(function() {
        var isFinished = true;
        for (var prop in completionFlags) {
            isFinished = isFinished && completionFlags[prop];
        };
        if (isFinished) {
            clearInterval(monitorId);
            callback();
        }
    }, 10);
}
