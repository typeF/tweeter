const md5 = require('md5');

module.exports = {

  generateAvatar: (userInfo) => {
    const avatarUrlPrefix = `https://vanillicon.com/${md5(userInfo.username)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    return {
      name: userInfo.name,
      handle: "@" + userInfo.username,
      avatars: avatars
    };
  }
};
