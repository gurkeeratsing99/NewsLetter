const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

require('dotenv').config();
console.log(process.env);
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/" , function(req, res){

  res.sendFile(__dirname+"/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("The server is running at 3000 port")
});

app.post("/", function(req , res){
  const firstName= req.body.firstName;
  const lastName= req.body.lastName;
  const email = req.body.email;
  const key = process.env.API_KEY;
  const id = process.env.ID;


  const data={
    members:[
      {
        email_address: email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

  var jData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/"+id;
  const options = {
    method : "POST",
    auth: "gs:"+key
  };
  const request = https.request(url , options , function(response){
        if(response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
          console.log(response.statusCode);
        }
        else{
          res.sendFile(__dirname+"/failure.html");
          console.log(response.statusCode);
        }
    response.on("data", function(data){
    });
  });


request.write(jData);
request.end();
});

app.post("/failure" , function(req , res){
    res.redirect("/");
});
