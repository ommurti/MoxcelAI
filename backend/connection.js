const mongoose = require('mongoose');
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const url="mongodb+srv://maryam1505aziz_db_user:FIDsi4gr323lv4XT@cluster0.a4tc4b5.mongodb.net/mydb?appName=Cluster0"


mongoose.connect(url)
.then((result) => {
    console.log('mongodb connected')
    
})
.catch((err) => {
    console.log(err);
    
});