const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const multer = require("multer");


const app = express();
const port = 9050;
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const myPassword = "oriolukxhzzakbrq";

app.use(express.json())
app.use(express.text())
app.use(cors({origin: "*"}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post("/", upload.single("cv"), (req, res) => {
    var emFirstName = req.body.emFirstName;
    var emLastName = req.body.emLastName;
    var emAdress = req.body.emAdress;
    var emEmail = req.body.emEmail;
    var emTel = req.body.emTel;
    var emCountry = req.body.emCountry;
    var emProfession = req.body.emProfession;
    var cvBuffer = req.file.buffer;
    let resObject = {};

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yassine.bazgour@gmail.com',
            pass: myPassword
        }
    });
    
    var mailOptions = {
        from: 'yassine.bazgour@gmail.com',
        to: 'yassine.bazgour@gmail.com',
        subject: 'New Employee Application',
        html:
        `
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333;">New Employee Application Details:</h2>
                <ul>
                    <li><strong>First Name:</strong> ${emFirstName}</li>
                    <li><strong>Last Name:</strong> ${emLastName}</li>
                    <li><strong>Address:</strong> ${emAdress}</li>
                    <li><strong>Email:</strong> ${emEmail}</li>
                    <li><strong>Phone Number:</strong> ${emCountry}-${emTel}</li>
                    <li><strong>Profession:</strong> ${emProfession}</li>
                </ul>
            </div>   
        `,
        attachments: [{ filename: `${emFirstName}_${emLastName}_CV.pdf`, content: cvBuffer }]
    };

    try {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                resObject = { success: false, error: "Error sending submission." };
            } else {
                console.log('Submission sent: ' + info.response);
                resObject = { success: true };
            }
            res.send(resObject);
        });
    }
    catch (error) {console.log(error);}
});

app.listen(port, () => console.log("Listening on port " + port));