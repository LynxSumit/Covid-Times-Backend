import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import {config} from "dotenv"
import nodemailer from "nodemailer"
const app = express()
// Path for env files 
config({
    path : "./data/config.env"
})
// Data Base Connected 
mongoose.connect(process.env.MONGO_URI,{dbName : "ContactsDB"}).then((result) => {
    console.log("MongoDB Connected Successfully")
}).catch((err) => {
    console.log(err);
});

// middleware 
app.use(cors({
    origin : [process.env.URL1 , process.env.URL2],
    methods : ["POST"],
    credentials : true
}))
app.use(express.json())
const ContactSchema = new mongoose.Schema({
    name : String,
    phone : String,
    email : String,
    address : String,
    message : String
})
// collection 
const Contacts = new mongoose.model("ContactData", ContactSchema )

// contact route 
app.post("/contact", async (req,res)=>{
    const {name, phone, email, address , message} = req.body
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : " skumarupadhyay1@gmail.com",
            pass : "hzhxyplifdvdmoqs"
        }
    })
    const mailOptions = {
        from : process.env.EMAIL,
        to : 'vijaypmaurya786@gmail.com',
        subject : `Hey Vijay ${name} wants to talk to you `,
        html : `<h4>name : ${name} <br> email : ${email} <br> phone : ${phone} <br> Address : ${address} </h4><br><br><p>${message}</p>`,

    }
    transporter.sendMail(mailOptions , (error , info)=>{
        if(error){
            console.log("error occuref in info and error section")
        }else{
            console.log(info.response)
        }
    })
 let contactDetails =   await Contacts.create({
        name,
        email,
        message,
        address,
        phone
    })
  res.status(201).json({
    success : true,
    Message : "Message Sent Successfully",
    contactDetails
  })
})


// App Started  
app.listen(process.env.PORT, ()=>{
    console.log("Server started on https://localhost:" + process.env.PORT)
})