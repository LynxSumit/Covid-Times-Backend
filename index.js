import express from "express"
import mongoose from "mongoose"
import {config} from "dotenv"
const app = express()
// Path for env files 
config({
    path : "./data/config.env"
})
// Data Base Connected 
mongoose.connect(process.env.MONGO_URI,{dbName : "ContactsDB"}).then((result) => {
    console.log("MongoDB Connected Successfully")
}).catch((err) => {
    console.log(err)
});

// middleware 
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
    let contactDetails = await Contacts.findOne({email})
    if(contactDetails){
        return res.json({
            success : true,
            meraMessage : "Ye Already pada hua tha",
            contactDetails
        })
    }
    
  contactDetails =   await Contacts.create({
        name,
        email,
        message,
        address,
        phone
    })
  res.status(201).json({
    success : true,
    meramessage : "Kaam Ho Gaya",
    contactDetails
  })
})


// App Started  
app.listen(5000, ()=>{
    console.log("Server started")
})