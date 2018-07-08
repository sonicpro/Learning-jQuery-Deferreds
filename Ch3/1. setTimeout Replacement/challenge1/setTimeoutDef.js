function wait(timeout) {
    var deferred = $.Deferred(function(d) {
        setTimeout(d.resolve, timeout);
    });
    return deferred.promise();
}

wait(500).done(function() {
    console.log('Timeout fired');
});
