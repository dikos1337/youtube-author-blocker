function hideAuthors(blockedAuthors) {
  // List of blocks with video
  $("ytd-video-renderer").each(function () {
    let currentBlock = $(this);

    // List of links to video authors
    let authors = currentBlock.find(
      "a[class='yt-simple-endpoint style-scope yt-formatted-string']"
    );

    // Removing an author from the list of blocks with a video if his nickname is in the banned list
    authors.each(function () {
      if (blockedAuthors.includes($(this).text())) {
        currentBlock.detach();
        // console.log($(this).text() + " is blocked")
      }
    });
  });
}

function getDataAndHideAuthors() {
  chrome.storage.sync.get("blockedAuthors", function (data) {
    const blockedAuthors = data["blockedAuthors"] || [];
    hideAuthors(blockedAuthors);
  });
}

function waitForEl(selector, callback, maxtries = false, interval = 100) {
  const poller = setInterval(() => {
    const el = jQuery(selector);
    const retry = maxtries === false || maxtries-- > 0;
    if (retry && el.length < 1) return; // will try again
    clearInterval(poller);
    callback(el || null);
  }, interval);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.changeInfo.status === "complete") {
    if (window.location.href.includes("/feed/trending")) {
      let pollerCounter = 0;
      let eventPoller = setInterval(function () {
        waitForEl("ytd-video-renderer", getDataAndHideAuthors);
        pollerCounter++;
        if (pollerCounter >= 10) {
          clearInterval(eventPoller);
        }
      }, 100);
    }
  }
});
