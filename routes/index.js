const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const axios = require("axios");

// API Routes
router.use("/api", apiRoutes);

// If no API routes are hit, send the React app


router.get("/api/search", (req, res) => {
  console.log(req.query.search);
  let search = "https://www.googleapis.com/books/v1/volumes?q="+req.query.search+"&key=AIzaSyDjb5O9VCc6popbJ7bbvPIp9xIts2sLQ10";
  console.log(search);
  axios
    .get(search)
    .then(results => {
    // {console.log(results.data)})
    // console.log(results.data.items)
    res.json(results.data)})
    // .catch(err => res.status(422).json(err));
    .catch(err => console.log(err));
});

router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
