const express = require('express');
const upload = require("express-fileupload");
const { docxToPdfFromPath, initIva } = require("iva-converter");
const { writeFileSync } = require("fs");
const { basename } = require("path");
const port = process.env.PORT || 80;




const app = express();
app.use(upload())

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
})



app.post('/upload', function(req, res) {
    
    console.log(req.files.upfile.mimetype);


  if(req.files.upfile && req.files.upfile.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){

    const file = req.files.upfile;
    const name = file.name;
    const type = file.mimetype;

    const uploadpath = __dirname + '/uploads/' + name;

    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else{
        initIva("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWJlZjJjZDVmNmZkMDAwMjk4YjRiNGYiLCJjcmVhdGVkQXQiOjE1ODk1NzI4NzA3MTAsImlhdCI6MTU4OTU3Mjg3MH0.Oyl4XRtRsPU3PcdYyIOqBg-9Kx5rTJHT2gMnGCTpcPM");
        const filePath = __dirname + '/uploads/' + name;
        docxToPdfFromPath(filePath)
          .then((pdfFile) => {
            writeFileSync(__dirname + "/uploads/" + basename(filePath).replace(".docx", ".pdf"), pdfFile);
            res.download(__dirname + "/uploads/" + basename(filePath).replace(".docx", ".pdf"));
          })
          .catch((err) => {
            console.log(err)
          });
      }

    });
  }
  else {
    res.send("No valid file selected!");
    res.end();
  };
})

app.listen(port, () => {
  console.log("Server trči!");
  console.log(process.platform);
}); 