function wait(timeout) {
    var deferred = $.Deferred(),
        waitInterval = setTimeout(deferred.resolve, timeout);
    var promise =  deferred.promise();

    // Not a best coding style to append properties for object you did not create.
    promise.cancel = function () {
        clearInterval(waitInterval);
        deferred.rejectWith(deferred, arguments);
    };
    return promise;
}

var promise = wait(500);

// The callback has to be prevented from firing!
promise.done(function() {
    console.log('Timeout fired');
});

promise.fail(function (args) {
    console.log(args);
});

// Here how do we accomplish that.
promise.cancel('Firing has been prevented');

