// Cannot get it working, it is not relevant because Google is removing chrome extensions from Windows.

// Chrome local storage API uses callbacks. Lets wrap it to use promises instead.

function set(items) {
    var deferred = $.Deferred();

    chrome.storage.local.set(items, function () {
        if(chrome.runtime.lasterror) {
            deferred.reject("chrome.runtime.lasterror.message");
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise();
}

function runSet() {
    set({
        lastUrl: "http://bit.ly/jquery-deferreds",
        timestamp: new Date().toUTCString()
    }).done(function() {
        console.log("keys for the user's last URL and timestamp saved to local storage.");
    });
}    
