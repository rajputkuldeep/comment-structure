const express = require('express')
const app = express()
require('./database')
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const routes = require('./src/routes');

app.use("/", routes);


// var QRCode = require("qrcode");

// QRCode.toString("9624777501", { type: "terminal" }, function (err, url) {
//   console.log(url);
// });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
