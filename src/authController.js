const UsersDB = require('./dbController');
const path = require('path');
const User = require('./User');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require('./config')

const generateAccessToken = (username, password) => {
    const payload = {username, password}
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController{
    constructor(){
        const dbFile = path.resolve(__dirname, 'users.db');
        console.log(dbFile);
        this.usersDB = new UsersDB(dbFile);
        console.log(this.usersDB);
    }

    connectDB(){
        this.usersDB.init();
    }

    async registration(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({message: "registration error", errors})
            }
            const user = new User(req.body.userName, req.body.email, req.body.password);
            const result = await this.usersDB.addUser(user);
            if (result === -1) {
                res.status(400).json('user already exists');
            }
            if (result === 1) res.status(200).json('user addded');
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'registration error'})
        }
    }

    async login(req, res){
        try {
            const userName = req.body.userName;
            const password = req.body.password;
            const loginResult = await this.usersDB.login(userName, password);
            switch(loginResult){
                case -2:
                    res.status(400).json(`wrong password`);
                    break;
                case -1:
                    res.status(400).json(`username ${userName} not found`);
                    break;
                case 1:
                    const token = generateAccessToken(userName, password);
                    res.status(200).json({token});
                    break;
                default:
                    res.status(400).json('login error');
            }
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'login error'})
        }
    }

    async getUsers(req, res){
        try {
            const usersArray = await this.usersDB
                .getAllUsers()
                .then((users) => {return users});
            const obj = Object.assign({}, usersArray);
            console.log(obj);    

            res.json('server work');
        } catch(e) {
            console.log(e);
        }
    }

    addUsers(req, res){
        try{
            const createUsers = require('./createUsers')
            createUsers(this.usersDB);
            res.status(200).json('init users added');
        } catch(e) {
            console.log(e);
        }            
    }

}

module.exports = new authController()