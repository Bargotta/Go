// http://debuggable.com/posts/run-intense-js-without-freezing-the-browser:480f4dd6-f864-4f72-ae16-41cccbdd56cb


WorkQueue = {
    _timer: null,
    _queue: [],
    add: function (fn, context, time) {
        var setTimer = function (time) {
            WorkQueue._timer = setTimeout(function () {
                time = WorkQueue.add();
                if (WorkQueue._queue.length) {
                    setTimer(time);
                }
            }, time || 8);
        }

        if (fn) {
            WorkQueue._queue.push([fn, context, time]);
            if (WorkQueue._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = WorkQueue._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window);
        return next[2];
    },
    clear: function () {
        clearTimeout(WorkQueue._timer);
        WorkQueue._queue = [];
    }
};