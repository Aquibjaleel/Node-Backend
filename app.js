const bcrypt = require('bcrypt');
const saltRounds = 10;


const express = require('express')
const app = express()
const pug = require('pug')
const PORT = 2000;
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
//const { response } = require('express'); no need already done above
const jwt = require('jsonwebtoken');
//const { json } = require('body-parser'); no need already done
var cors = require('cors')



app.set('view engine', 'pug')
app.set('views', './views')
app.use('/assets', express.static('assets'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())


mongoose.connect('mongodb://localhost/shirt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) {
        console.log("error message", err)

    }
    else {
        console.log("db connected")
    }
});
require('./models/Book')
const Book = mongoose.model('Book') 
require('./models/Car')
const Car = mongoose.model('Car')
require('./models/User')
const User = mongoose.model('User')
require('./models/Newuser')
const Newuser = mongoose.model('Newuser')

app.get('/', function (req, res) {

    res.send('new page')
})

app.get('/home', function (req, res) {
    res.render('home')
})
app.get('/index', function (req, res) {
    res.render('index')
}
)

app.get('/user', (req, res) => {
    res.send('This is user new page');
})


app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })
   
  app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
  })

// /profile/varun
// /profile/aquib
// /profile/anas

app.get('/profile/:username/:rollno/about', function (req, res) {
    console.log('Data -> ', req.params);
    res.send('Profile ')
})
app.get('/employeename/:username/', function (req, res) {
    if (req.params.username == 'Aquib') {
        console.log('heee');
        // res.send('employeename Aquib')
        res.render('index', { name: req.params.username, isFound: true })

    } else {
        console.log('Data -> ', req.params);
        // res.send('not an employee')
        res.render('index', { isFound: false })
    }


})

// app.get('/book/add/:name/:author',function(req, res){
//   var book = new Book()
//   book.name = req.params.name;
//   book.author = req.params.author;
//   book.save();
// //   res.send('Book added ->')
// res.json({
//     message: "book added"
//   })

// })

app.post('/book/add', (req, res) => {
  console.log(req.body)
  var book = new Book()
    book.name = req.body.name;
    book.author = req.body.author;
    book.save().then((data) => {
    console.log(data);
        res.json({
            id: data._id,
            message:"book added"    
        })
    });
  //   res.send('Book added ->')
  // res.send('book added ->')

//   res.json({
//     message: "book added"
//   })
  })
app.get('/book/list', (req, res) => {
  Book.find().then((data) => {
    console.log(data);
    // res.send("item listed")
    res.json({
      book: data
    })
  })
})

app.post('/book/update/:id', (req, res) => {
  Book.updateOne({ _id: req.params.id }, { name : req.body.name , author: req.body.author }).then((data) => {
    console.log('Data',data);
    res.json({
     message: "book updated"
    })
  }).catch((err) => {
    console.log('Err ',err);
})
res.send("data updated thanku")
})
app.post('/book/delete/:id', (req, res) => {
    Book.deleteOne({ _id: req.params.id }).then((data) => {
        console.log('Data', data);
        res.status(200).json({
            message: "book deleted"
        })
    }).catch((err) => {
        console.log('Err ', err);
    })


})

app.get('/car/add/:name/:color/:model/:year', function (req, res) {
    var car = new Car()
    car.name = req.params.name;
    car.color = req.params.color;
    car.model = req.params.model;
    car.year = req.params.year;
    car.save();
    res.send('car added ->')
})
app.post('/car/add', function (req, res) {
    console.log(req.body)
    var car = new Car()
    car.name = req.body.name;
    car.color = req.body.color;
    car.model = req.body.model;
    car.year = req.body.year;
    car.save();
    //   res.send('car ->')
    // res.send('car added ->')

    res.json({
        message: "book added"
    })
})
app.post('/car/delete/:id', (req, res) => {
    Car.deleteOne({ _id: req.params.id }).then((data) => {
        console.log('Data', data);
        res.status(408).json({
            message: "car deleted"
        })
    }).catch((err) => {
        console.log('Err ', err);
    })


})
app.post('/user/sign-up', (req, res) => {
    console.log(req.body)
    var user = new User()

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        user.name = req.body.name;
        user.email = req.body.email;
        user.hash = hash;

        user.save();
    });


    //   res.send('Book added ->')
    // res.send('book added ->')

    res.json({
        message: "user added"
    })
})
app.post('/user/login', (req, res) => {
    User.findOne({ email: req.body.email }).then((data) => {
        console.log('Data', data);
        bcrypt.compare(req.body.password, data.hash, function (err, result) {
            // result == true just a comment

            console.log(result);
            if (result) {
                //   res.send('user logged in succesfully')
                // jwt.sign({ id: data._id }, 'AWH' , function(err, token) {
                //   console.log(token);
                // });
                jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: { id: data._id }
                }, 'AJ', (err, token) => {
                    console.log(token);
                    res.json({
                        user: token,
                                               

                    })
                })

            }
            else {
                res.send('user password incorrect')
            }

        });
    })
})

app.post('/user/userinfo', (req, res) => {
    console.log(req.body)
    // var user = new User()
    // user.token = req.body.token
    // user.save();

    jwt.verify(req.body.token, 'AJ', function (err, decoded) {
        console.log(decoded) // bar
        User.findOne({ _id: decoded.data.id }).then((data) => {
            console.log('Data', data);
        res.json({
            user: data.email
        })  
        })
    })


})



app.post('/newuser/sign-up', (req, res) => {
    console.log(req.body)
    var newuser = new Newuser()

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
     
        newuser.name = req.body.name;
        newuser.email = req.body.email;
        newuser.age = req.body.age;
        newuser.status = req.body.status;
        newuser.hash = hash;
        newuser.save();
    });


    //   res.send('Book added ->')
    // res.send('book added ->')

    res.json({
        message: "user added"
    })
})
app.post('/newuser/login', (req, res) => {
    User.findOne({ email: req.body.email }).then((data) => {
        console.log('Data', data);
        bcrypt.compare(req.body.password, data.hash, function (err, result) {
            // result == true just a comment

            console.log(result);
            if (result) {
                //   res.send('user logged in succesfully')
                // jwt.sign({ id: data._id }, 'AWH' , function(err, token) {
                //   console.log(token);
                // });
                jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: { id: data._id }
                }, 'AJ', (err, token) => {
                    console.log(token);
                    res.json({
                        user: token,


                    })
                })

            }
            else {
                res.send('user password incorrect')
            }

        });
    })
})

app.get('/newuser/userinfo', (req, res) => {
    console.log('new type',req.headers)
  

    jwt.verify(req.headers.authorization, 'AJ', function (err, decoded) {
        console.log(decoded) // bar
        User.findOne({ _id: decoded.data.id }).then((data) => {
            console.log('Data', data);
        res.json({
            
            user: data.email
        })  
        })
    })


})
app.listen(PORT, (err) => {
    if (err) {
        console.log('Error -> ', err);
    }
    console.log("App started at", PORT);
})
