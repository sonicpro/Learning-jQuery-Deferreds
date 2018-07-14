/*global require, module */

// Non-blocking FIFO queue where we can put arbitrary items and get an item which was put first then.
// Using of deferreds allow getting the items immediately from the empty queue.
var $ = require("jquery-deferred"),
    // If nobody put an item yet but another consumer requested an item,
    // use "waiting" array to hold the deferreds that we return to the requester.
    waiting = [],
    // "queue" array holds the actual items the consumer is putting to the queue.
    queue = [];

var makeQueue = module.exports = {
    get: function() {
        var deferred;

        if (queue.length) {
            deferred = $.Deferred().resolve(queue.shift());
        } else {
            deferred = $.Deferred();
            waiting.push(deferred);
        }
        return deferred.promise();
    },

    put: function(item) {
        if (waiting.length) {
            // Resolve the deferred that has already returned by get() with the actual data.
            waiting.shift().resolve(item);
        } else {
            queue.push(item);
        }
    }
};

        
