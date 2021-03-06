
//DEN HÄR KÄLLKODSFILEN FUNGERAR OM REQUEST-LISTENER, DVS. ALLA INKOMMANDE REQUESTS TILL SERVERN STYRS HIT
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const hatRoutes = require('./routes/hats');
//const userRoutes = require('./routes/users');


//Sätter upp förbindelsen till databasen
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://hatboi:boxplot@Cluster0.xhhrn.mongodb.net/Cluster0?retryWrites=true&w=majority');


//Alla inkommande request loggas på konsolen
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false }));

//Parsar automatiskt alla inkommande JSON-objekt.
app.use(bodyParser.json());

//Om en request riktats till localhost:8080/products styrs requesten till product.js
app.use('/hats', hatRoutes);



//Om en inkommande request varken är riktad mot /products eller /orders triggas denna metod
app.use((req, res, next) => {
    //Skapar ett nytt Error-objekt där vi ställer in "gällande fel"
    const error = new Error("Requested resource not found! Supported resources are /hats");
    error.status = 404;
    //Skickar "erroret" vidare till nästa app.use
    next(error);
});

//Denna metod triggas av vilket som helst fel som uppstår under exekveringen. next(error) anropet på rad 23 triggar även denna metod
app.use((error, req, res, next) => {
    //Vi skapar ett json-objekt där vi beskriver felet som uppstått. Vi ställer in status och error-message enligt det som finns i
    //error-objektet och skickar det till klienten
    res.status(error.status || 500).json({
        status: error.status,
        error: error.message
    });
});

module.exports = app;