const User = require('./User');

module.exports = async function (db){
    user1 = new User('user1', 'some@email', '123');
    user2 = new User('user2', 'some@email', '456');
    user3 = new User('user3', 'some@email', '789');
    user4 = new User('user4', 'some@email', '963');

    await db.addUser(user1);
    await db.addUser(user2);
    await db.addUser(user3);
    await db.addUser(user4);
}