const urls = {
  configs: {
    get: "",
    put: "",
  },
  settings: {
    put: "",
  },
  users: {
    post: "",
  },
};
export default {
  post: async function (to, data) {
    const url = urls[to]["post"];
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },

  put: async function (to, data) {
    const url = urls[to]["put"];
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },

  get: async function (to, data) {
    const url = urls[to]["get"];
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },
};
