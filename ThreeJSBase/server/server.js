const express = require('express');
const path = require('path');

const app = express();



app.get("/", (requisition, result)=>{
    result.sendFile(path.join(__dirname,'../', 'dev.html'))
})
app.use(express.static(path.join(__dirname, '../')));

app.listen(8080, ()=>{
    console.log("Server running on port 8080");
});
