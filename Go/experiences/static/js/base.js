/**********************************************************************
 * base.js
 *
 * A module for common functions across all pages
 *********************************************************************/

/**
* Returns a function, that, as long as it continues to be invoked, will not
* be triggered. The function will be called after it stops being called for
* wait milliseconds.
*/
function debounce(func, wait) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context,args);
			// console.log("debounce finished: calling service...");
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

/**
* Search across site... Unfinished
*/
var search = debounce(function () {
	console.log("searching...");
}, 250);

/**
* Clear current search
*/
function resetSearch() {
	$('#input-outer input').val('');
}

/**
* Initialize helper functions
*/
$(document).ready(function readyFnc() {
	// clear search on click
	$('#clear').click(function() {
		resetSearch();
		$('#input-outer input').focus();
	});
});
