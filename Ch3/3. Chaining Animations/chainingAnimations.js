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
            // The returned function reurns a promise and will be passed to .then as callback.
            // Notice that the function nas no arguments, i.e. we discard any value the previous animation
            // had been resolved with. The ultimate goal is to get all the animation called one-by-one, any values are not passed through.
            return function() {
                var host = $(selector);
                return func.apply(host, args).promise();
            };
        };

    for (i = 0; i < tasks.length; i++) {
        task = tasks[i];
        
        func = task.shift();
        selector = task.shift(); // now the "task" variable is just an arguments array.
        // Set promise variable to the new promise returned by .then(). The old value of "promise" won't be
        // garbage-collected because the callback that is set on the previous loop iteration is bound to it.
        // As a result we will build the chain if "animate" functions where each of those it bould to run on the
        // previous completion. The first animation is started immediately as it is bound to the resolved promise created in the line #10.
        promise = promise.then(animationFuncFactory(func, selector, task));
    }
    return promise; // will be resolved when the last animation completes.
}

var promise = synchronously([
    [ $("#label1").animate, "#label1", { opacity: 0.25 }, 100 ],
    [ $("#label2").animate, "#label2", { opacity: 0.10 }, 500 ],    
    ]);


promise.done(function () {
    console.log("All the animations are completed");
});
