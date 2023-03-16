require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { connect } = require("./db/connect");
const schedule = require('node-schedule');
const nodemailer = require("nodemailer");
const client = require("./db/connect");
const moment = require('moment');
const routerUsers = require("./routers/users");
const routerEmail = require("./routers/sendemail");
const routerDomain = require("./routers/domains");
const routerContractors = require("./routers/contractors");
const routerEvents = require("./routers/events");
const routerCategorys = require("./routers/categorys");
const routerRefreshToken = require("./routers/refresh");

const app = express();
 
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routerUsers);
app.use("/", routerEmail);
app.use("/", routerDomain);
app.use("/", routerContractors);
app.use("/", routerEvents);
app.use("/", routerCategorys);
app.use("/", routerRefreshToken);

connect(process.env.MONGO_URL, (err) => {
  if (err) {
    console.log("Erreur lors de la connexion à la base de données");
    process.exit(-1);
  } else {
    console.log("Connexion avec la base de données établie");
    app.listen(PORT, () => {
      console.log(`Node.js App running on port ${PORT}...`);
  })   
  }
});

async function sendReminderNotificationEmail(title,date) {
  try {
    let cursor = client
      .db()
      .collection("users")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    var emails = '';
    if (result.length > 0) {
      for(const e of result){
        if(e.recievesNotifications){
          if(emails == ''){
            emails = e.email;
          }else{
            emails = emails +',' + e.email;
          }
         }
      }  
    } else {
      res.status(204).json({ msg: "No users found" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'ben.younes.ihab3@gmail.com',
      pass: 'nuiyhjgmjwwidbbp'
    }
  });
  
  var mailOptions = {
    from: 'ben.younes.ihab3@gmail.com',
    to:emails,
    subject:`Rappel : ${title}`,
    text:`Vous avez rappel pour : ${title} ${date}` 
  }

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error(error);
      };
  });
}
async function sendEmail(name) {
  try {
    let cursor = client
      .db()
      .collection("users")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    var emails = '';
    if (result.length > 0) {
      for(const e of result){
        if(e.recievesNotifications){
          if(emails == ''){
            emails = e.email;
          }else{
            emails = emails +',' + e.email;
          }
        }
      }  
    } else {
      res.status(204).json({ msg: "No users found" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'ben.younes.ihab3@gmail.com',
      pass: 'nuiyhjgmjwwidbbp'
    }
  })
  var mailOptions = {
    from: 'ben.younes.ihab3@gmail.com',
    to:emails,
    subject:`Expiration de votre domaine ${name}`,
    text:`Votre domaine ${name} `
  }

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error(error);
      };
  });
}
async function sendNotification(){
  try {
    let cursor = client
      .db()
      .collection("domains")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      let counter = 0;
      for(const domain of result){
        // let dbDate = e.expiration_date[0];
        let dbDate = domain.expiration_date;
        const idate = new Date(dbDate);
        idate.setDate(idate.getDate() -14);
        let day = idate.getDate();
        let month = idate.getMonth();
        let year = idate.getFullYear();
        const fdate = new Date(year, month, day, 8, 00, 00).getTime();
        const now = new Date().getTime();
        if(fdate <= now && counter < 6){
          if(counter==4){
            let lastmessage = `${domain.name} et plusieurs autres domaines vont bientôt s'expirer`
            sendEmail(lastmessage).catch(console.error);
            return
          }
          let message = `${domain.name} va bientôt s'expirer`
          sendEmail(message).catch(console.error);
          counter = counter + 1;
        }
      }
    } else {
      res.status(204).json({ msg: "No domains found" });
    }
    
  } catch (error) {
    res.status(501).json(error);
  }
}

const job = schedule.scheduleJob('00 00 09 * * 0-6', function(){
  sendNotification();
});


async function sendReminderNotification(){
  try {
    let cursor = client
      .db()
      .collection("events")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      for(const e of result){
        if(e.type == 'Rappel'){
          let dbDate = e.date;
          let now = Date();
          if(now == dbDate){
            moment.locale("fr");    
            let fdate = moment().calendar();
            sendReminderNotificationEmail(e.title,fdate);
          }
        }
      }
    }
  }catch(error) {
      console.log(error);
  }
}
const job2 = schedule.scheduleJob('* * * * * *', function(){
  sendReminderNotification();
});
