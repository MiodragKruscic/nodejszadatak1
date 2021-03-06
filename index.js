const express = require("express");
const upload = require("express-fileupload");
const { docxToPdfFromPath, initIva } = require("iva-converter");
const { writeFileSync } = require("fs");
const { basename } = require("path");
const nodemailer = require("nodemailer");
let bodyParser = require('body-parser')
const port = process.env.PORT || 80;
let useing = undefined;
require("dotenv").config();


const app = express();
app.use(upload());
app.use(bodyParser.text({defaultCharset : true}));
app.use(express.static(__dirname + '/public'));




app.post('/upload', function(req, res) {
  

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
            useing = __dirname + "/uploads/" + basename(filePath).replace(".docx", ".pdf");
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



app.post('/download',function(req,res){

     res.download(useing);
})


app.post('/email',function(req,res){

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "muskthe7th@gmail.com", 
      pass: "teslarocks123"
    }
  });
  const mailOptions = {
    from: "muskthe7th@gmail.com",
    to: req.body.textual.toString(),
    subject: "01010100 01101000 01100101 00100000 01110000 01100100 01100110 00100000 01111001 01101111 01110101 00100000 01110111 01100001 01101110 01110100 01100101 01100100 00100001",
    text: "01000101 01101100 01101111 01101110 01100111 01100001 01110100 01100101 01100100 00100000 01001101 01110101 01110011 01101011 01110010 01100001 01110100",
    attachments: [
      {
        filename: basename(useing),
        path: useing.toString()
      }
    ]
  }

  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      console.log(error);
    }
    else {
      console.log("Email was sent to: " + req.body.textual.toString());
    }
  })

})

app.listen(port, () => {
  console.log("Server trči heheh!");
}); 