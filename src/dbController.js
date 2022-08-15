const sqlite3 = require('sqlite3').verbose()
const {hashPassword, comparePassword} = require('./pass')
const User = require('./User')


module.exports = class UsersDB{
    constructor(dbName){
        this.dbName = dbName;
        this.db  = 'empty DB';
    }

    init(){
        this.db = new sqlite3.Database(this.dbName, (err) => {
            if (err) {
                console.log(this.dbName);
                console.log('error connecting to DB');
                return console.error(err.message);
            }
            console.log('connection success');
        })
        const sql = `CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username, email, password)`;
        this.db.run(sql, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('table users ok');
                }
        });
    }
 
    async login(userName, password){
        const sql = `SELECT * FROM users WHERE username = ?`;
        const promise =  new Promise((resolve, reject) => {
            this.db.get(sql, [userName], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(0);
                }
                if (row) {
                    const passwordCheck = comparePassword(password, row.password);
                    if (passwordCheck) {
                        resolve(1);
                    } else {
                        resolve(-2);    
                    }
                } else {
                    resolve(-1);
                }
            })
        })
        return promise.then((res) => {return res})
    }

    findUserByEmail(){
        
    }

    async existsUser(userName){
        const sql = `SELECT username FROM users WHERE username = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [userName], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(true);
                }
                if (row) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    }

    async getAllUsers(){
        const sql = `SELECT * FROM users`;
        return new Promise((res, rej) => {
            this.db.all(sql, function(err, rows) {
                if(err) {
                    console.log(err.message);
                    rej(undefined);
                }
                res(rows);
            })
        });
        // return new Promise((resolve, reject) => {
        //     this.db.get(sql, [userName], (err, row) => {
        //         if (err) {
        //             console.log(err);
        //             reject(true);
        //         }
        //         if (row) {
        //             resolve(true);
        //         } else {
        //             resolve(false);
        //         }
        //     })
        // })
    }


    async addUser(user){
        const isUser = await this.existsUser(user.userName).then(res => {return res});
        if (isUser) return -1;
        user.password = await hashPassword(user.password);
        const arr = user.toArray();
        const sql = `INSERT INTO users(userName, email, password) VALUES(?,?,?)`;
        this.db.run(sql, arr, (err) => {
            if (err) console.log(err);
        });
        return 1;
    }
}