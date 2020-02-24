module.exports = function (app,jwt, connection) {
    app.post('/api/authverification', (req, result) =>{
        //verify token
        jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET, function (err, payload) {
            if (err) {
                result.json({ status: false })
            }
            else{

                //Vefirify if role is changed or not
                var sql = "SELECT * FROM vambo.users where email = ?";
                connection.query(sql, [payload.email], (err, results, fields) => {
                    if ( err ) {
                        result.json({ status: false , role: results[0].isAdmin })
                    } else {
                        result.json({status: true , role: results[0].isAdmin })
                    }
                })
            }
        });
    })
}