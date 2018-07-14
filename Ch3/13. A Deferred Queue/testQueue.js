/*global require */

var queue = require("./makeQueue");


queue.put(1);
var first = queue.get();
var second = queue.get();
var third = queue.get();
queue.put(2);
queue.put(3);

first.done(console.log);
second.done(console.log);
third.done(console.log);
