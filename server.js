const express = require('express')
const app = express()
require('./database')
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const routes = require('./src/routes');




app.use("/", routes);

app.listen(3000, () => {
  console.log("temppppp");
  console.log("Server running on port 3000");
});
