const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const LogInCollection = require("./mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../template');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

mongoose.connect("mongodb+srv://zekeyeager18:ragebater18@cluster0.tttvr3k.mongodb.net/first?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((e) => {
        console.error('Mongoose connection failed:', e);
    });

const LogIn = LogInCollection.LogIn;
const bus = LogInCollection.bus;
const vol = LogInCollection.vol;
app.get('/sgb', (req, res) => {
    res.render('sgb');
});
app.get('/sgv', (req, res) => {
    res.render('sgv');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/signup/volunteers', (req, res) => {
    res.render('signup1');
});
app.get('/signup/business', (req, res) => {
    res.render('signup');
});


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/h1', (req, res) => {
    res.render('home1');
});
app.post('/signup/business', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const existingUser = await bus.findOne({ name: req.body.name });

        if (existingUser) {
            res.send("User already exists");
        } else {
            await bus.create(data);
            console.log(data);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred during signup");
    }
});

app.post('/signup/volunteers', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        id: req.body.id,
        skill: req.body.skill,
        Exp: req.body.Exp,
        lang: req.body.lang
    };

    try {
        const existingUser = await vol.findOne({ name: req.body.name });

        if (existingUser) {
            res.send("User already exists");
        } else {
            await vol.create(data);
            console.log(data);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred during signup");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogIn.findOne({ name: req.body.name });
        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}` });
        } else {
            res.send("Incorrect username or password");
        }
    } catch (e) {
        res.send("An error occurred during login");
    }
});
app.post("/query", async (req, res) => {
    try {
        const { query, query1 } = req.body;

        // Create an object to store search criteria
        const searchCriteria = {};

        // Check if query and query1 are provided and add them to the search criteria
        if (query) {
            searchCriteria.skill = query;
        }

        if (query1) {
            searchCriteria.Exp = { $gte: query1 };
        }

        // Perform the search based on the constructed searchCriteria
        const results = await vol.find(searchCriteria);

        if (results.length > 0) {
            // Prepare an HTML container for the cards
            let responseText = '<div class="container" ><div class="row" style="display:flex; text-align:space-between ;justify-content:space-between ;text-align:center;margin-top:15%">';

            // Generate a card for each result
            results.forEach((result) => {
                responseText += `
                    <div class="col-md-8">
                        <div class="card>  
                        <img src="https://source.unsplash.com/random/800x800/?img=1" class="card-img-top" alt="Image" style="width:120px; height:120px;">
                            <div class="card-body">
                            <img src="https://source.unsplash.com/random/800x800/?img=1" class="card-img-top" alt="Image" style="width:120px; height:120px;">
                                <h3 class="card-title">${result.name}</h3>
                                <p class="card-text">Experience: ${result.Exp}</p>
                                <p class="card-text">Email: ${result.email}</p>
                                <p class="card-text">Skill: ${result.skill}</p>
                                <p class="card-text">Language: ${result.lang}</p>
                    
                            </div>
                        </div>
                    </div>
                `;
            });

            // Close the container
            responseText += '</div></div>';

            // Send the response as HTML
            res.send(responseText);
        } else {
            res.status(404).send("No matching documents found");
        }
    } catch (e) {
        res.status(500).send("An error occurred during the search");
    }
});


