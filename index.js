const PORT = 8000;
const axios = require("axios").default;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
app.get("/word", (req, res) => {
  const options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: { count: "5", wordLength: "5" },
    headers: {
      "x-rapidapi-host": "random-words5.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      // console.log(response.data);
      res.json(response.data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
});
app.get("/check", (req, res) => {
  const word = req.query.word;
  var options = {
    method: "GET",
    url: "https://twinword-word-graph-dictionary.p.rapidapi.com/association/",
    params: { entry: word },
    headers: {
      "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      // console.log(response.data);
      res.json(response.data.result_msg);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(process.env.PORT||PORT, () => console.log("Server is running on port " + PORT));
