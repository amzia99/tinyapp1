// express server code
const express = require("express");
const app = express();
const PORT = 8080; // Default port

// URL database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Function to generate short URL
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// Middleware
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Log views path
console.log("Views Path:", app.get("views"));

// GET Routes

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (!longURL) {
    return res.status(404).send("Short URL not found.");
  }
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// POST Routes

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL; // store in database
  console.log("Updated urlDatabase:", urlDatabase); // for debugging
  res.redirect(`/urls/${shortURL}`); // redirect to /urls/:id
});


// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
