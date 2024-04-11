var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // You can replace 3000 with any port number you prefer

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define schema for user data
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phno: String,
    password: String
});

// Define model based on schema
var User = mongoose.model("User", userSchema);

// Handle POST request to /sign_up
app.post("/sign_up", (req, res) => {
    var userData = {
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno,
        password: req.body.password
    };

    // Create new User instance
    var newUser = new User(userData);

    // Save user data to database using promises
    newUser.save()
        .then(() => {
            console.log("Redirecting to success page");
            res.redirect('/signup_successful.html'); // Change the path to the signup successful page
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error registering user");
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
