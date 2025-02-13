// express server code
const bcrypt = require("bcryptjs");
const express = require("express");
const cookieSession = require("cookie-session");

// import helper function
const { getUserByEmail } = require("./helpers");

const app = express();
const PORT = 8080;

// cookie session middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey1", "secretKey2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hour expiry
  }),
);

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Users object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
};

// URL database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW", // User created url
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW", // User created url
  },
};

// return URLS created by specific user
const urlsForUser = (id) => {
  let filteredURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      filteredURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredURLs;
};

// Function to generate short URL
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// Middleware to pass user object to all templates
app.use((req, res, next) => {
  const userId = req.session.user_id;
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
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    return res.status(403).send("Please log in or register to view URLs.");
  }

  const userURLs = urlsForUser(userID);

  // debugging for long URLS
  console.log("User URLs Data:", userURLs);

  const templateVars = { user, urls: userURLs };
  res.render("urls_index", templateVars);
});

// Create URL page for logged in user
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    return res.redirect("/login"); // now redirect to login page
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// Show specific URL page
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const urlEntry = urlDatabase[req.params.id];

  if (!user) {
    return res.status(403).send("You must be logged in to view this page.");
  }

  if (!urlEntry) {
    return res.status(404).send("Short URL not found.");
  }

  if (urlEntry.userID !== userID) {
    return res.status(403).send("You do not own this URL.");
  }

  const templateVars = { user, id: req.params.id, longURL: urlEntry.longURL };
  res.render("urls_show", templateVars);
});

// Redirect short URL to long URL
app.get("/u/:id", (req, res) => {
  const urlEntry = urlDatabase[req.params.id];

  if (!urlEntry) {
    return res.status(404).send("Short URL not found.");
  }

  res.redirect(urlEntry.longURL);
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
  const userId = req.session.user_id;
  if (users[userId]) {
    return res.redirect("/urls");
  }
  res.render("register");
});

// Show the login form
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (users[userId]) {
    return res.redirect("/urls");
  }
  res.render("login");
});

// POST Routes

// Create new URL for logged in users
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!users[userID]) {
    return res.status(403).send("You must be logged in to create a short URL.");
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: String(req.body.longURL), userID: userID };

  // debugging for long URL
  console.log("Updated URL Database:", urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

// Update existing URL
app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlEntry = urlDatabase[req.params.id];

  if (!userID) {
    return res.status(403).send("You must be logged in to edit URLs.");
  }

  if (!urlEntry) {
    return res.status(404).send("Short URL not found.");
  }

  if (urlEntry.userID !== userID) {
    return res.status(403).send("You do not own this URL.");
  }

  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

// Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlEntry = urlDatabase[req.params.id];

  if (!userID) {
    return res.status(403).send("You must be logged in to delete URLs.");
  }

  if (!urlEntry) {
    return res.status(404).send("Short URL not found.");
  }

  if (urlEntry.userID !== userID) {
    return res.status(403).send("You do not own this URL.");
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid email or password.");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Register new user
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already exists. Please log in.");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = generateRandomString();
  users[userId] = { id: userId, email, password: hashedPassword };

  req.session.user_id = userId;
  res.redirect("/urls");
});

// Start server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
