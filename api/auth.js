module.exports = function (app, bcrypt, jwt, connection) {

    app.post('/api/auth', (req, result) =>{

         //Authenticate User
         var message;
         const PasswordError = "Password is not correct";
        const Email = req.body.Email;
        var sql = "SELECT * FROM vambo.users where email = ?";
        connection.query(sql, [req.body.Email], (err, results, fields) => {
            if(!err){
                //Check if query get something from database
                if(results.length > 0){
                    //Compare Password
                    bcrypt.compare(req.body.Password,results[0].password,function(err, res){
                        if(res){
                            if ( results[0].isVerified == true ){
                                 //Creat token
                                    const email = { email: Email }
                                    const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})//default: Hs256 encryption
                                    
                                    // verify token
                                    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (err, payload) {
                                        if (err) {
                                            return console.log('ERROR: ', err);
                                            
                                        }
                                        else{
                                            result.json({ accessToken: accessToken, role: results[0].isAdmin  })
                                            
                                        }
                                    });
                            } else {
                                message = "Your Account is not Verified, Please check your email to verify your account";
                                result.json({ message: message})
                            }
                            
                        }else{
                            console.log("Password is not Correct");
                            message = "Password is not Correct";
                            result.json({ message: message})
                        }

                    });
                }else{
                    message = "Email is not Authorised";
                    result.json({ message: message})
                }
            }else{
                message = "Email is not Authorised";
                result.json({ message: message})
            }
        });
    });
}