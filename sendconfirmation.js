module.exports = function (app,transporter, jwt) {
          //Send Email Verification
          const email2 = { email: 'etlhako12@gmail.com' }
          const accessToken = jwt.sign(email2, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})//default: Hs256 encryption
          let HelperOptions = {
              from : '"Evans Tlhako" <etlhako12@gmail.com>',
              to : 'etlhako12@gmail.com',
              subject: 'Vambo email verification',
              text: 'Click on this link to verify your email <a href=http://localhost:8080/verification?token='+accessToken+'"'
            };
            
            transporter.sendMail(HelperOptions, (err, info) =>{
              if(err){
                console.log(err);
              } else {
                console.log('The message was send');
                console.log(info);
              }
            });
}