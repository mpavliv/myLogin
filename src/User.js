class User{

    constructor(userName, email, password){
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    toArray(){
        return [this.userName, this.email, this.password]
    }
}

module.exports = User;