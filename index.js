const authRouter = require('./src/authRouter');
const express = require('express')
const PORT = 8000;



const app = express();
app.use(express.json());
app.use('/auth', authRouter);


const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        })
    } catch(err) {
        console.log(err);
    }
}

start()