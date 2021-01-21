const App = {
  data() {
    return {
      inputUsername: "",
      localUserList: [],
    };
  },
  methods: {
    deleteUserFromChromeStorage(username) {
      chrome.storage.sync.get("blockedAuthors", (data) => {
        let tmpUserList = data["blockedAuthors"] || [];
        tmpUserList = tmpUserList.filter((item) => item != username);
        chrome.storage.sync.set({ ["blockedAuthors"]: tmpUserList });
        this.updateLocalUserList();
      });
    },
    addUserToChromeStorage() {
      // checking that the input is not empty
      if (this.inputUsername.trim()) {
        if (this.isUserAlreadyBlocked(this.inputUsername) === false) {
          chrome.storage.sync.get("blockedAuthors", (data) => {
            const tmpUserList = data["blockedAuthors"] || [];
            tmpUserList.push(this.inputUsername);
            chrome.storage.sync.set({ ["blockedAuthors"]: tmpUserList });
            this.inputUsername = ""; // Clear input
            this.updateLocalUserList();
          });
        }
      }
    },
    updateLocalUserList() {
      chrome.storage.sync.get("blockedAuthors", (data) => {
        const tmpUserList = data["blockedAuthors"] || [];
        this.localUserList = tmpUserList;
      });
    },
    isUserAlreadyBlocked(username) {
      return this.localUserList.includes(username);
    },
  },
  watch: {
    inputUsername(value) {
      if (value.length >= 30) {
        this.inputUsername = this.inputUsername.slice(0, 30); // max length is 30
      }
    },
  },
  mounted: function () {
    this.updateLocalUserList();
  },
};

Vue.createApp(App).mount("#popup");
