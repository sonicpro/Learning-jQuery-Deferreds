// This function is a replacement for the multiple .then or .done chainings to get multiple async operations
// invoke one by one.


// Assume that each element in the tasks array is in turn an array.
// An element with the index=0 in the item array is the function which return value has promise() method (like $.animate()).
// The element in the index=1 is the selector for the element that the animation is called on.
// The rest elements of the item array are the arguments to the function in index[0] position.
function synchronously(tasks) {
    var i, task, selector, func,
        promise = $.Deferred().resolve().promise(),
        animationFuncFactory = function(func, selector, args) {

            return function() {
                var host = $(selector);

                // If the "func" return value does not have promise() method,
                // return a plain value from the constructed function.
                var asyncResult = func.apply(host, args);
                if (("promise" in asyncResult) && typeof asyncResult === "function") {
                    func.apply(host, args);
                    return $.Deferred().resolve();
                } else {
                    return asyncResult;
                }
            };
        };

    for (i = 0; i < tasks.length; i++) {
        task = tasks[i];
        
        func = task.shift();
        selector = task.shift(); // now the "task" variable is just an arguments array.

        // Unlike the correct "synchronously" function implementation using .then(), when
        // use .done() instead we effectively attach all the callbacks to the single promise defined in
        // the line #10.
        promise = promise.done(animationFuncFactory(func, selector, task));
    }
    return promise; // Firstly, in this incorrect implementation all animations are running in parallel.
    // Secondly, the callback of the syncronously() function returned promise also fires immediately, before the animations finish.
}

var promise = synchronously([
    [ $("#label1").animate, "#label1", { opacity: 0.10 }, 5000 ],
    [ $("#label2").animate, "#label2", { opacity: 0.10 }, 5000 ],    
    ]);


promise.done(function () {
    console.log("All the animations are completed");
});
