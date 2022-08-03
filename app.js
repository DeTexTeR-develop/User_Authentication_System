const express = require('express');
const bcrypt = require('bcrypt');
const { urlencoded } = require('express');
const path = require('path');
const app = express();
const port = 3030;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const users = []; //create db to store this

app.get('/users', (req, res)=> {
    res.send(users);   
});

app.get('/registerUser', (req, res) => {
    res.render('index')
})
app.post('/registerUser', async(req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = {username: req.body.username , password : hashedPassword};
        users.push(user);
        res.status(201).send();
    }catch{
        res.status(500).send();
    }
});

app.post('/login', async(req, res) => {
        const user = await users.find(user => user.username === req.body.username )
        if(user == null){
            return res.status(400).send('user not found!');
        }
        try{
            if(await bcrypt.compare(user.password, req.body.password)){
                res.send('success');
            }else{
                res.send('username or password wrong!')
            }
        }
        catch{
            res.status(500).send();
        }
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
} )