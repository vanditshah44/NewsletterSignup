const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
// Mail Chimp API Key
// 9181fc3dec40a1cca56cfe5e85c56c95-us18
// List ID
// a87c0f4535
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// In order to use the static CSS file and Images or any other resources we need to create a Static Express Folder name public and add all the resource Files to that static folder so we can use that folder in the file 
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    // This is the whole data MailChimp needs to enter and we are passing it as a string JSON and we are writing it into the request down 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us18.api.mailchimp.com/3.0//lists/a87c0f4535"

    const options = {
        method: "POST",
        auth: "vandit1:9181fc3dec40a1cca56cfe5e85c56c95-us18"
    }
// To Send Data or TO Post Data on API we need to do the HTTPS request and not HTTPS get method and in request method we need to give 3 parameters URL, Options, Functions and In Options we need to pass the API key and the Method get or Post and we are storing it in a variable so we can write the data which the API needs and then we are ending out request and we are performing this all in POST 
// app.post() so that we are making a post request and not the get request  
    const request = https.request(url, options, function(response) {
        
        // response.on("data", function(data) {
        //     console.log(JSON.parse(data))
           
        // })
        // 
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })

    request.write(jsonData);
    request.end()


})

app.post("/failure", function(req, res) {
    res.redirect("/");
})
// Because We wanted to upload this code to heroku 3000 port won't work so we need to define this process in order to get port from heroku and this is a heroku function and to run locally we are giving here an OR operator to run the port on 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('listening on port 3000');
})