module.exports = {
  type: "app",
  app: "reddit",
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://oauth.reddit.com`;
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._accessToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return await require("@pipedreamhq/platform").axios(this, opts);
    },

    async getNewSubredditLinks(after_link, subreddit) {
      const newSubredditLinks = await this._makeRequest({
        path: `/r/${subreddit}/new`,
        params: {
          after: after_link,
        },
      });

      return newSubredditLinks;
    },
  },
};