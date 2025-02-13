// express server code
const express = require("express");
const app = express();
const PORT = 8080;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Users object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


// URL database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Function to generate short URL
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// Middleware to pass user object to all templates
app.use((req, res, next) => {
  const userId = req.cookies["user_id"];
  res.locals.user = users[userId] || null; 
  next();
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Log views path
console.log("Views Path:", app.get("views"));

// Middleware if a short URL exists in the database
function validateShortURL(req, res, next) {
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.status(404).send("Short URL not found.");
  }
  next();
}

// GET Routes

// Root route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// URLs index page
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = {
    user,
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});


// Create URL page
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; 

  const templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
});


// Show specific URL page
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; 

  const id = req.params.id;
  const longURL = urlDatabase[id];

  if (!longURL) {
    return res.status(404).send("Short URL not found.");
  }

  const templateVars = {
    user,
    id,
    longURL,
  };
  res.render("urls_show", templateVars);
});


// Redirect short URL to long URL
app.get("/u/:id", validateShortURL, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  console.log(`Redirecting to: ${longURL}`);
  res.redirect(longURL);
});

// JSON representation of URLs
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Hello page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Show the registration form
app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = {
    user, 
  };
  res.render("register", templateVars);
});

// Show the login form
app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = {
    user,
  };

  res.render("login", templateVars);
});




// POST Routes

// Create new URL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  if (!longURL.startsWith("http://") && !longURL.startsWith("https://")) {
    return res.status(400).send("Invalid URL. Please include http:// or https://");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  console.log("Updated urlDatabase:", urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Update existing URL
app.post("/urls/:id", validateShortURL, (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  if (!newLongURL.startsWith("http://") && !newLongURL.startsWith("https://")) {
    return res.status(400).send("Invalid URL. Please include http:// or https://");
  }
  console.log(`Updating Short URL ${id} with new URL: ${newLongURL}`);
  urlDatabase[id] = newLongURL;
  res.redirect("/urls");
});

// Delete URL
app.post("/urls/:id/delete", validateShortURL, (req, res) => {
  const id = req.params.id;
  console.log(`Deleting Short URL ${id}`);
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Helper function to find a user by email
const getUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

  // check if user exists
  if (!user) {
    return res.status(403).send("User not found.");
  }

  // check if password matches
  if (user.password !== password) {
    return res.status(403).send("Incorrect password.");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id"); 
  res.redirect("/urls");
});


// Register new user
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // check for empty fields
  if (!email || !password) {
    return res.status(400).send("Error: Email and password are required.");
  }

  // check if email is registerd
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Error: Email already exists. Please login.");
  }

  // generate a unique user ID
  const userId = generateRandomString();

  // add new user to users database
  users[userId] = {
    id: userId,
    email,
    password,
  };

  console.log("Updated users database:", users);

  
  res.cookie("user_id", userId);
  res.redirect("/urls");
});



// Start server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
