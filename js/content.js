function hideAuthors(blockedAuthors) {
    // List of blocks with video
    $("ytd-video-renderer").each(
        function () {
            let context = $(this);

            // List of links to video authors
            let authors = context.find("a[class='yt-simple-endpoint style-scope yt-formatted-string']")

            // Removing an author from the list of blocks with a video if his nickname is in the banned list
            authors.each(function () {
                if (blockedAuthors.includes($(this).text())) {
                    context.detach();
                    console.log($(this).text() + " is blocked")
                }
            })
        }
    )
}



if (window.location.href.includes("/feed/trending")) {
    chrome.storage.sync.get('blockedAuthors', function (data) {
        const blockedAuthors = data["blockedAuthors"] || [];
        hideAuthors(blockedAuthors)
    });
}
