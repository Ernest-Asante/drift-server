// Import the express module
const express = require('express');

const mmsendOtpRoute = require('./mmsendotp');
const mmsendOtpRouteD = require('./d_mmsendotp');
const mmverifyOtpRoute = require('./mmverifyotp');
const mmverifyOtpRouteD = require('./d_mmverifyotp');
const resendOtpRoute = require('./resendotp');
const resendOtpRouteD = require('./d_resendotp');
const mmsendOtpRoute2 = require('./mmsendotp2');
const mmsendOtpRoute2D = require('./d_mmsendotp2');
const mmsendOtpRoute3 = require('./mmsendotp3');
const mmsendOtpRoute3D = require('./d_mmsendotp3');
const mmverifyOtpRoute2 = require('./mmverifyotp2');
const mmverifyOtpRoute2D = require('./d_mmverifyotp2');
const mmverifyOtpRoute3 = require('./mmverifyotp3');
const mmverifyOtpRoute3D = require('./d_mmverifyotp3');
const mmverifyOtpRoute4 = require('./mmverifyotp4');
const mmverifyOtpRoute4D = require('./d_mmverifyotp4');
const resendOtpRoute2 = require('./resendotp2');
const resendOtpRoute2D = require('./d_resendotp2');
const getFirstName = require('./getfirstname');
const getFirstNameD = require('./d_getfirstname');
const addPanicRoute = require('./addpanic');
const addCarDetailsRoute = require('./d_addcardetails');
const getProfileRoute = require('./getprofile'); 
const getCoordinates = require('./distance'); 
const getClosest = require('./closest');  
const getMy = require('./my');  
const orderRide = require('./orderRide');  
const rideRequest = require('./driverpage'); 
const acceptRide = require('./acceptRide'); 
const rejectRide = require('./rejectRide'); 
const riderConnect = require('./riderconnect'); 
const bodyParser = require("body-parser")
const cors = require('cors');
// Create an instance of express 
const app = express();


// Define a port for the server to listen on
const port = 3001;

app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 

// Import the verifyOTP route
//const sendOtpRoute = require('./sendotp');




// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

  
app.use('/mmotpsend',mmsendOtpRoute);
app.use('/d_mmotpsend',mmsendOtpRouteD);
app.use('/mmverifyotp',mmverifyOtpRoute); 
app.use('/d_mmverifyotp',mmverifyOtpRouteD); 
app.use('/otpresend',resendOtpRoute);  
app.use('/d_otpresend',resendOtpRouteD);  
app.use('/mmotpsend2',mmsendOtpRoute2); 
app.use('/d_mmotpsend2',mmsendOtpRoute2D); 
app.use('/mmotpsend3',mmsendOtpRoute3); 
app.use('/d_mmotpsend3',mmsendOtpRoute3D); 
app.use('/mmverifyotp2',mmverifyOtpRoute2);  
app.use('/d_mmverifyotp2',mmverifyOtpRoute2D); 
app.use('/mmverifyotp3',mmverifyOtpRoute3); 
app.use('/d_mmverifyotp3',mmverifyOtpRoute3D); 
app.use('/mmverifyotp4',mmverifyOtpRoute4); 
app.use('/d_mmverifyotp4',mmverifyOtpRoute4D); 
app.use('/otpresend2',resendOtpRoute2);  
app.use('/d_otpresend2',resendOtpRoute2D);  
app.use('/getfirstname',getFirstName);  
app.use('/d_getfirstname',getFirstNameD);  
app.use('/addpanic',addPanicRoute);  
app.use('/d_addcardetails',addCarDetailsRoute);  
app.use('/getprofile',getProfileRoute);  
app.use('/coordinates',getCoordinates); 
app.use('/distance',getClosest); 
app.use('/my',getMy); 
app.use('/orderride',orderRide); 
app.use('/riderequest',rideRequest); 
app.use('/acceptride',acceptRide); 
app.use('/rejectride',rejectRide); 
app.use('/riderconnect',riderConnect); 
