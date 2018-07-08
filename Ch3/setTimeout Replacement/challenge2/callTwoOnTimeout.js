function wait(timeout) {
    var deferred = $.Deferred(function(d) {
        setTimeout(d.resolve, timeout);
    });
    return deferred.promise();
}

// function one() {
//     console.log('one');
// }

// function two() {
//     console.log('two');
// }

// wait(500).done([one, two]);

function one(promise) {
    promise.done(console.log.bind(null, 'one'));
}

function two(promise) {
    promise.done(console.log.bind(null, 'two'));
}

var promise = wait(500);

one(promise);
two(promise);
