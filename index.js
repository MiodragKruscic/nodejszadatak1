const express = require('express');
const upload = require("express-fileupload");
const libre = require('libreoffice-convert');
const path = require('path');
const fs = require("fs");
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
      else {
        const extend = '.pdf'
        const enterPath = path.join(__dirname, `/uploads/${name}`);
        const outputPath = path.join(__dirname, `/uploads/${name}${extend}`);
        const enterpath = fs.readFileSync(enterPath);


        libre.convert(enterpath, extend,undefined,(err, content) => {
            if (err) {
              console.log(`Error converting file: ${err}`);
            }
            
            fs.writeFileSync(outputPath,content);
            res.download(outputPath);
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