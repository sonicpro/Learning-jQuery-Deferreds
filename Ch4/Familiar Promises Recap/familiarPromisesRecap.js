/*global $, setTimeout */

function someTimeConsumingOperation1() {
    var def = $.Deferred();
    setTimeout(def.resolve.bind(def, 1), 1000);
    return def.promise();
}

function someTimeConsumingOperation2() {
    var def = $.Deferred();
    setTimeout(def.resolve.bind(def, 2), 500);
    return def.promise();
}

$.when(
    someTimeConsumingOperation1().then(function() {
        // It is not necessary to call .promise() on the result of animate() because $.when() will do that for you.
        return $("#label1").animate({ opacity: 0.25 }, 100);
    }),
    someTimeConsumingOperation2().then(function() {
        // If we omit the return statement in the "filter" function passed to .then(), the new promise will be resolved with the value of "undefined".
        return $("#label2").animate({ opacity: 0.75 }, 500);
    })
).then(
    function(result1, result2) {
        console.log("Both time-consuming operations and both animations have completed. The animations have completed with the results: " + result1 + " and " + result2 + ".");
    });
