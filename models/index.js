var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

const Page = db.define('page', {
    title: {type: Sequelize.STRING, allowNull: false},
    urlTitle: {type: Sequelize.STRING, allowNull: false, isUrl: true},
    content: {type: Sequelize.TEXT, allowNull: false},
    status: Sequelize.ENUM('open', 'closed')
    // date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
  }, {
    getterMethods: {
        route() {
            return "/wiki/" + this.urlTitle;
        }
    }
    });

Page.hook('beforeValidate', (page, options) => {
    if (page.title) {
        page.urlTitle = page.title.toString().replace(/\s+/g, '_').replace(/\W/g, '');
    } else {
        page.urlTitle = Math.random().toString(36).substring(2, 7);
      }
    });

const User = db.define('user', {
    name: {type: Sequelize.STRING, allowNull: false},
    email: {type: Sequelize.STRING, allowNull: false, validate:{isEmail: true}}
});

module.exports = {
    Page: Page,
    User: User,
    db: db
};