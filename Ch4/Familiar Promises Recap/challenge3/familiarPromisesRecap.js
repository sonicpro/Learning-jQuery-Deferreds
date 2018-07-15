/*global $, setTimeout */

// The goal is to arrange the results of someTimeConsumingOperation1 and someTimeConsumingOperation2 to pass to the "final" function passed to the outermost then().

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
    someTimeConsumingOperation1().then(function(innerResult) {
        return $.Deferred(function(def) {
            $("#label1").animate({ opacity: 0.25 }, 100).promise().done(def.resolve.bind(def, innerResult));
        });
    }),
    someTimeConsumingOperation2().then(function(innerResult) {
        return $.Deferred(function(def) {
            $("#label2").animate({ opacity: 0.75 }, 500).promise().done(def.resolve.bind(def, innerResult));
        });
    })
).then(
    function(result1, result2) {
        console.log("Both time-consuming operations and both animations have completed. Time-consuming operations completed with the results: " + result1[0] + " and " + result2[0] + ".");
    });
