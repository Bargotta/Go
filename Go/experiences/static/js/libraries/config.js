var VideoSources = {
    commentMap: {},
    data: {},
    Comments: {},
    MetaData: {},
    SalonData: {},
    SalonVideoDocuments: {},
    Tags: {},
    Roots: [],
    Replies: [],
    childMap: [],

    //Videoclips
    videoClips: [],
    //Video subtitles
    videoSubtitles: []
};

var commonDataSource = {
    userDetails: [],
    alreadyloading: false
};

var config = function () {
    var timeDifference = function (previous) {

        previous = new Date(parseInt(previous.substr(6)));

        var current = new Date();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    };

    var stringLimit = function (string, length) {
        if (string.length > length) {
            return string.substring(0, length) + "...";
        } else {
            return string;
        }
    };

    //Uses JSRender's render function, adds to it
    var render = function (template, target, dataArray, isRefresh) {

        if (isRefresh === undefined) {
            isRefresh = false;
        }
        var html = "";
        template = '#' + template;
        target = '#' + target;

        //Replaces the html with the template specified in the html file (e.g. for the video page,
        //the template is defined in the video.html file
        if (isRefresh) {
            $(target).html('');
            $(target).html($.templates(template).render(dataArray));
        } else {
            $(target).append($.templates(template).render(dataArray));
        }

        //If there is no information to render
        if (dataArray == "" || dataArray.length == 0) {
            if (target == "#Videoes") {
                $(target).html(getEmptyText('No videoes...!'));
                return;
            } else if (target == "#transcript") {
                $(target).html(getEmptyText('No transcript...!'));
                return;
            } else if (target == "#comment_panel") {
                $(target).html(getEmptyText('No Comments...!'));
                return;
            } else if (target == "#home-recent") {
                $(target).html(getEmptyText('No videoes...!'));
                return;
            } else if (target == "#home-salons") {
                $(target).html(getEmptyText('No salons...!'));
                return;
            } else if (target == "#salon-videoes") {
                $(target).html(getEmptyText('No videoes in this salon...!'));
                return;
            }
        }

        if (dataArray.roots != undefined) {
            if (dataArray.roots.length == 0) {
                $("#comment_panel").html(getEmptyText('No Comments...!'));
                return;
            }
        }

        function getEmptyText(msg) {
            return '<div style="margin: 10px; text-align: center; color: gray; padding: 10px;max-width: 680px; margin: 50px auto; position: relative;"><div class="ui-grid-a"><h2>' + msg + '</h2></div></div>';
        }

    };

//Pagination function
    var paginate = function (page) {
        if (page === "home-recent") {
            homePage.getRecentVideoes($("#home-recent-page-no").val());
        }
        if (page === "home-salons") {
            homePage.getRecentSalons($("#home-salon-page-no").val());
        }
        if (page === "salon-page") {
            salonPage.getRecentSalonVideos($("#salon-video-page-no").val(), salonId);
        }
    };

    var removeDuplicates = function (selector, key) {
        var found = {};
        $(selector).filter(function () {
            var ending = this.getAttribute('data-vid').replace(key, "");
            if (found.hasOwnProperty(ending)) {
                return this;
            } else {
                found[ending] = ending;
            }
        }).remove();
    };

    var getuserDetailsById = function (userId) {
        var postData = { userId: userId };
        $.ajax({
            type: "GET",
            url: "mobile_dev_2015/Services/salon.asmx/GetUserDataById",
            data: postData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d == "failed") return;
                var userDetails = eval('(' + msg.d.valueOf().toString() + ')');
                commonDataSource.userDetails = userDetails;

                $(".loggedUserImg").attr("src", "/memberpics/" + commonDataSource.userDetails[0].Picture);
                $(".loggedUserName").text(commonDataSource.userDetails[0].UserName);

            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    };

    // Changes XML to JSON
    var xmlToJson = function (xml) {
        var obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };

    var showPaginationLoder = function (uid, pageId) {
        var html = "<div id='" + uid + "' class='loading wow fadeIn animated' style='padding: 10px; margin: 5px; background-color: white;'>" +
            "<div>" +
            "<p style='text-align: center;margin-bottom: 0;'><img src='/mobile/mobile_dev_2015/images/ajax-loader.gif' alt='loading...'></p>" +
            "</div>" +
            "</div>";
        $(".loading").remove();
        $(pageId).append(html);
        //$(pageId + ":last").after(html);

        $('html, body').animate({ scrollTop: $(document).height() }, 10);
    };

    return {
        render: render,
        stringLimit: stringLimit,
        timeDifference: timeDifference,
        paginate: paginate,
        removeDuplicates: removeDuplicates,
        getuserDetailsById: getuserDetailsById,
        xmlToJson: xmlToJson,
        showPaginationLoder: showPaginationLoder
    };
} ();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function showMessage(type, msgTitle, msgText) {
    var id = new Date().getTime();
    var dv = $.parseHTML("<div style='z-index:500; display: none;' id='" + id + "' class='" + type + " message wow fadeIn'><h3>" + msgTitle + "</h3><p>" + msgText + "</p></div>");

    $("body").append(dv);
    $('#' + id).fadeIn();
    setTimeout(function () {
        $('#' + id).fadeOut();
    }, 4000);
}


function linkifyText(linkifyText) {

    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = linkifyText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links
    var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

//Allows for pagination
$(document).scroll(function () {
    if ($(document).height() > $(window).height()) {
        if (!commonDataSource.alreadyloading) {
            if ($(document).height() - 20 <= ($(window).height() + $(window).scrollTop())) {
                        console.log('derp');
                var scrollPage = $("li.active  a").data("page");
                if (scrollPage === undefined) {
                    scrollPage = $(".ui-page-active").attr("data-page");
                }
                var lastChild = "#" + scrollPage + " div:last-child";
                if (!$(lastChild).hasClass("nomore")) {
                    config.paginate(scrollPage);
                }
            }
        }
    }
});

//Allows us to keep track of a counter in the views
var vars = {}

$(document).on("ready", function () {
    jQuery.ajaxSetup({
        cache: false
    });

    $.views.tags({
        setvar: function(key, value) {
            vars[key] = value;
        },

        increment: function(key) {
            vars[key] = vars[key] + 1;
        }
    });

    //Helper variables can be used in the views for layouts
    $.views.helpers({
        getvar: function(key) {
            return vars[key];
        },

        transcriptNewline: function () {
            return (vars["counter"]%4 == 0);
        },

        currentVideo: function () {
            return $('#video-id').val();
        },

        commonDataSource: commonDataSource,
        VideoSources: VideoSources,
        prettyDate: prettyDate,
        substr: function (string, length) {
            //config.stringLimit(string, length);
            if (string.length > length) {
                return string.substring(0, length) + "...";
            } else {
                return string;
            }
        },
        nl2br: function (text) {
            var vvv = [];
            $(text.split("\n")).each(function (index, value) {
                vvv.push(linkifyText(value));
            });
            vvv = vvv.join("<br/>");
            return vvv;
        }
    });

    $.views.converters({
        prettydate: function (val) {
            val = new Date(parseInt(val.substr(6)));

            var result = moment(new Date((new Date(val).getTime()))).fromNow();
            if (result != undefined) {
                return result;
            }
            return "never";
        },
        pretty: function (val) {
            var result = moment(new Date(val)).fromNow();
            if (result != undefined) {
                return result;
            }
            return "never";
        },
        time: function (val) {

            var num = parseInt(val);
            var minutes = Math.floor(num / 60);
            var seconds = Math.floor(num % 60);

            if (seconds < 10) { seconds = "0" + seconds; }

            return (minutes + ":" + seconds);

        }
    });

    config.getuserDetailsById(authenticatedUserId);

    $(document).on("tap", 'a[data-icon="refresh"]', function () {
        location.reload();
    });

    //Playlist functions
    $(document).on("click", '.div-item', function (e) {
        var dirAttr = $(this).attr('data-href');
        var vidTypeAttr = $(this).attr('data-vtype');
        var clicked = $(e.target);

        if (clicked[0].nodeName == "BUTTON") {
            return false;
        }

        if ($(clicked).hasClass('makeFav')) {
            return false;
        }

        if (typeof vidTypeAttr !== typeof undefined && vidTypeAttr !== false) {
            if (vidTypeAttr != 0) {
                showMessage('info', "This is a VIMEO video.", "This version does not support vimeo videos.");
                return false;
            }
        }

        if ($(this).hasClass("selected-div-item")) {
            return false;
        }

        $(".selected-div-item").removeClass("selected-div-item");
        $(this).addClass("selected-div-item");

        if (typeof dirAttr !== typeof undefined && dirAttr !== false) {
            var url = $(this).attr("data-href");
            setTimeout(function () {
                window.location.href = url;
            }, 100);
        } else {
            if (typeof vidTypeAttr !== typeof undefined && vidTypeAttr !== false) {
                $(".current-track").removeClass('current-track');
                $(this).addClass('current-track');

                //Loads another video
                var vid = $(this).attr('data-videoId');
                var youid = $(this).attr('data-youtubeId');
                loadAnotherVideo(vid, youid);
            }
        }
    });

    //NEED TO FIX THIS ASAP TODO
    $(document).on("click", '.comment-body', function () {
        $(".comment-body").removeClass("selected");
        $(this).addClass("selected");
        $(".comment_text").addClass("view-more");
        $(this).find(".comment_text").removeClass("view-more");
    });

    $(document).on("focus", '.ui-btn-icon-notext', function () {
        $(this).addClass("focusBtn");
    });

    $(document).on("focusout", '.ui-btn-icon-notext', function () {
        $(this).removeClass("focusBtn");
    });

    $(document).on("click", ".logout", function () {
        $.ajax({
            type: "POST",
            url: "/mobile/mobile_dev_2015/Services/auth.asmx/Logout",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log(data.d);
                window.location.href = '/mobile/mobile.aspx?page=login';

                //showMessage('success', "You've Successfully logged out...!", "You are redirecting to loging page. Please wait...!");
                //setTimeout(function () {
                //    window.location.href = '/mobile/mobile.aspx?page=login';
                //}, 1000);
                //                var d = eval('(' + data.d + ')');
                //                if (d.status == 'success') {
                //                    showMessage('success', d.msg, "You are redirecting to loging page. Please wait...!");
                //                    setTimeout(function () {
                //                        window.location.href = '/mobile/mobile.aspx?page=login';
                //                    }, 1000);
                //                }
                //                if (d.status == 'error') {
                //                    $.mobile.loading('hide');
                //                    showMessage('error', d.msg, "Please login before logout...!");
                //                    return false;
                //                }
            },
            error: function (msg) { console.log(msg); }
        });
    });
});

window.addEventListener("resize", function () {
    commonDataSource.DeviceHeight = $(window).height();
    commonDataSource.DeviceWidth = $(window).width();
});

//$( document ).bind("pageload", function (e, trigerDdata) {
//    var redirect = trigerDdata.xhr.getResponseHeader("X-Redirect");
//    if (redirect) {
//        trigerDdata.page.jqmData("redirect", redirect);
//    };
//});

//$(document).on("pageinit", "#main_page", function () {
//    //$.mobile.pageLoadErrorMessage = "Can't Load Page. retry...";
//    //$.mobile.changePage('/', { reloadPage: true, transition: "none"} );
//    /*$( document ).on( "swipeleft swiperight", "#main_page", function( e ) {
//        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
//            console.log(e);
//            if ( e.type === "swiperight"  ) {
//                $( "#menu_panel" ).panel( "open" );
//            }
//        }
//    });*/
//});

//$(document).on('pageshow', function () {
////    var formId = $.mobile.activePage.attr("id");
////    if (formId == "home") {

////        $.get("/mobile/mobile_dev_2015/home.html", function (data) {
////            $("#home").html(data);
////            console.log(data);
////        });

////    } else if (formId == "salon") {
////        console.log("salon");
////    } else if (formId == "video") {
////        console.log("video");
////    }
//});

