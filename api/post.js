module.exports = function (app, bcrypt, connection , transporter,jwt,uniqid,mime, fs) {

    //Getting current date
    var datetime = new Date();

    // Checking answer
    app.post('/api/CheckingAnswer', (req, res)=>{
        var sqlCheck = "SELECT * FROM vambo.wordassociation where answer = ?";
        connection.query(sqlCheck, [ req.body.Answer], (err, results, fields) => {
            if(err){
                console.log(err)
            } else {
                if(results.length > 0){
                    console.log('Wrong answer')
                } else {
                    console.log('Correct Answer')
                    let count =JSON.parse(JSON.stringify(results))
                    console.log(count)
                }
            }
        })
    })
     // Save all couserstarted
     app.post('/api/CourseForCurrentUser', (req, res) =>{
        var sqlCheck = "SELECT * FROM vambo.startedcourses where email = ?";
        connection.query(sqlCheck, [req.body.email], (err, results, fields) => {
            if(!err){
                let count =JSON.parse(JSON.stringify(results))
                let storeLessons =[];
                //Looping throw all Lessons
                 for (var i in results) {
                     var getallLesson = count[i].Lesson;
                     var getallCourse = count[i].coursename;
                     var getallLanguage = count[i].Languag;
                     storeLessons.push({Lesson: getallLesson, Language: getallLanguage, course:getallCourse });
                 }
                 console.log('Data is requested');
                 res.json(storeLessons);
                 
             }else{
                 console.log(err);
                 console.log('Data is not requested');
             }

        })
     })
     // Delete Started Course
     app.post('/api/DeleteStartedCourse', (req, res)=>{
        var sql = "DELETE FROM vambo.startedcourses WHERE languag =? and coursename =? and Lesson=? ";
        connection.query(sql, [req.body.Language,req.body.course,req.body.Lesson], (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                res.send({'message':'Data is deleted'});
            }
        })
     })

    // Save all couserstarted
    app.post('/api/UserCourseDetails', (req, res) =>{
        console.log(req.body)
        // Check if coursename and Lesson name exist
        var sqlCheck = "SELECT * FROM vambo.startedcourses where coursename = ? and Lesson = ? ";
        connection.query(sqlCheck,[req.body.coursename, req.body.Lesson],  (err, results, fields) =>{
            if(results.length > 0 ){
                res.send({'message':false});
            } else {
                var sql = "INSERT INTO vambo.startedcourses (email,languag,coursename,Lesson,Started_date) VALUES ?";
                var values =[[req.body.email,req.body.Language,req.body.coursename,req.body.Lesson, datetime]];
                connection.query(sql, [values], (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        res.send({'message':false});
                    } else {
                        res.send({'message':true});
                        console.log('Course stored ready to start');
                    }
                })
            }
        })
    })
     //Update Word Association Data
     app.post('/api/Update',(req, res)=>{
         console.log(req.body.answer)
         console.log(req.body.Option1)
         console.log(req.body.Option2)
         console.log(req.body.Option3)
         console.log(req.body.Id)
         console.log(req.body.ImageChange)
         // Update data and also new image 
         var sql = "UPDATE vambo.wordassociation SET option1 =? , option2 = ?,option3 = ?, answer = ?, ImagePath =? WHERE wordAssociationId = ?"

         // Sql query do update only if theres no new image update
         var sqlUpdate = "UPDATE vambo.wordassociation SET option1 =? , option2 = ?,option3 = ?, answer = ? WHERE wordAssociationId = ?";

         // Checking if new image exist
         if (req.body.ImageChange === undefined){
            connection.query(sqlUpdate, [req.body.Option1,req.body.Option2,req.body.Option3,req.body.answer, req.body.Id ], (err, results, fields) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({'message':'Data is Updated'});
                    console.log('Data is updated');
                }
            })
            
         } else {

            let matches = req.body.ImageChange.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
            // get image size from base64 string
            let response = {}
            if(matches.length !== 3){
            console.log('Something wrong')
            } else {
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');
                let decodeding = response;
                let imageBuffer = decodeding.data;
                let type = decodeding.type;
                let extension = mime.extension(type);
                let fileName = uniqid('ImageWA')+'.'+extension;
                fs.writeFileSync('./public/images/'+fileName, imageBuffer, 'utf8');
                connection.query(sql, [req.body.Option1,req.body.Option2,req.body.Option3,req.body.answer,fileName, req.body.Id ], (err, results, fields) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({'message':'Data is Updated'});
                    console.log('Data is updated');
                     // First Delete old image
                    fs.unlink('./public/images/'+req.body.oldPicture, function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('Old Image deleted!');
                        }); 
                    }
                })
            }
         }
     });

    //UpdateSentenceConstruction Data
    app.post('/api/UpdateDataSentance',(req, res)=>{
        var sql = "UPDATE vambo.sentancecontruction SET sentence =? , sentenseconstruction = ? WHERE SCId = ?";
        connection.query(sql, [req.body.Firstsentance,req.body.SecondUpsentance,req.body.Id ], (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                res.send({'message':'Data is Updated'});
                console.log('Data is updated');
            }
        })
    })

    //Delete wordAssociation delete quizz
    app.post('/api/deleteWordAssociation', (req, res)=>{
        var sql = "DELETE FROM vambo.wordassociation WHERE wordAssociationId =?";
        connection.query(sql, [req.body.Id], (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                res.send({'message':'Data is deleted'});
            }
        })
    })
    

    //Delete sentance 
    app.post('/api/deleteSentence', (req, res)=>{
        var sql = "DELETE FROM vambo.sentancecontruction WHERE SCId =?";
        connection.query(sql, [req.body.Id], (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                res.send({'message':'Data is deleted'});
            }
        })
    })

    //uploading sentance contruction
    app.post('/api/sentancecontruction', (req, res) =>{
        var sql = "INSERT INTO vambo.sentancecontruction (SCId  , sentence , sentenseconstruction ,Datecreated) VALUES ?";
        var values =[[uniqid('WordAss-'),req.body.sentance,req.body.sentanceContruction,datetime]];
        connection.query(sql, [values], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({'message':'Failed to create Sentence Contruction, Please call system administrator for help'});
            } else {
                res.send({'message':'Data saved you can create another Sentence Contruction'});
            }
        })

    })


     //Create Quiz
     app.post('/api/quiz', (req, res) => {
        console.log('Recieved')
        var sql = "INSERT INTO vambo.quiz (LessonID, quizId  , option1 , option2 , ImagePath  , AudioPath, Datecreated) VALUES ?";
       

            let matches = req.body.base64.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
            // get image size from base64 string
            let response = {}
            if(matches.length !== 3){
            console.log('Something wrong')
            } else {
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');
            let decodeding = response;
            let imageBuffer = decodeding.data;
            let type = decodeding.type;
            let extension = mime.extension(type);
            let fileName = uniqid('ImageWA')+'.'+extension;
              fs.writeFileSync('./public/images/'+fileName, imageBuffer, 'utf8');
              var values =[[req.body.LessonID,uniqid('Quiz-'),req.body.Option1,req.body.Option2,fileName,fileName,datetime]];
                connection.query(sql, [values], (err, results, fields) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({'message':'Data saved you can create another Quiz'});
                }
            })
        }
    })

    //Create word Association
    app.post('/api/WordAssociation', (req, res) => {
        console.log('Recieved')
        var sql = "INSERT INTO vambo.wordassociation (LessonID, wordAssociationId  , option1 , option2 , option3 , answer, lessonname, ImagePath  , Datecreated) VALUES ?";
       

            let matches = req.body.base64.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
            // get image size from base64 string
            let response = {}
            if(matches.length !== 3){
            console.log('Something wrong')
            } else {
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');
            let decodeding = response;
            let imageBuffer = decodeding.data;
            let type = decodeding.type;
            let extension = mime.extension(type);
            let fileName = uniqid('ImageWA')+'.'+extension;
              fs.writeFileSync('./public/images/'+fileName, imageBuffer, 'utf8');
              var values =[[req.body.LessonID,uniqid('WordAss-'),req.body.Option1,req.body.Option2,req.body.Option3,req.body.answer,req.body.lessonname,fileName,datetime]];
                connection.query(sql, [values], (err, results, fields) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({'message':'Data saved you can create another Word Association'});
                }
            })
        }
    })
    
    var message;
    //add user
    app.post('/api/users', (req, res) => {
        const user = req.body;
        var sql = "INSERT INTO vambo.users (Firstname , Surname , email , DateofBirth , password, isAdmin  , Datecreated, isVerified ) VALUES ?";
        const password = req.body.Password;
        const saltRounds = 10;
        //Check if email doesnt exist in the database
        var sqlCheck = "SELECT * FROM vambo.users where email = ?";
        connection.query(sqlCheck, [req.body.Email], (err, results, fields) => {
            if(results.length > 0 ){
                console.log(" Email exist")
                message = "Email exist";
                res.json({message: message});

            }else{
                //Hash password
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if (err) {
                        throw err
                    } else {
                        //Values to send to database
                        var values =[[req.body.firstName, req.body.Surname,req.body.Email,req.body.DateofBirth,hash,false,datetime,false]];
                        connection.query(sql, [values], (err, rows) => {
                            if (err) {
                                console.log(err)
                                
                                message = "Registration failed";
                                res.json({ message: message})
                    
                            } else {

                                const email2 = { email: req.body.Email }
                                const accessToken = jwt.sign(email2, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})//default: Hs256 encryption
                                let HelperOptions = {
                                    from : '"Vambo" <no-reply@vambo.co>',
                                    to : req.body.Email,
                                    subject: 'Vambo email verification',
                                    text: "To verify your email <a href=http://167.71.93.67:8080/api/verification?token=" + accessToken + 
                                    "'>Click here</a> "
                                };
                                transporter.sendMail(HelperOptions, (err, info) =>{
                                    if(err){
                                      console.log(err);
                                    } else {
                                      console.log('The message was send');
                                    }
                                  });

                                console.log('Registration is successful');
                                message = 'Registration is successful, Check your email for verification before you can Login';
                                res.json({ message: message})
                            }
                        });
                    }
                })
            }
        })
    });


    //Creating a Language
    app.post('/api/language', (req, Languageres) => {
        const Languagename = req.body.Language;
         //Check if language doesnt exist in the database
         var sqlCheck = "SELECT * FROM vambo.language where Language  = ?";
         connection.query(sqlCheck, [Languagename], (err, results, fields) => {
             if (err){
                Languageres.json({message: 'Failed to add language, call system administrator for help' });
                console.log(err);
             } else {
                if(results.length > 0 ){
                    console.log(" Language exist")
                    message = "Language exist";
                    Languageres.json({message: message});
    
                }else{
                    
                    //Insert statement to database
                    var sql = "INSERT INTO vambo.language (Language  , isActive, datecreated ) VALUES ?";
                    var values =[[Languagename,false,datetime]];
                    connection.query(sql, [values], (err, rows) => {
                        if (err) {
                            Languageres.json({message: 'Failed to add language, call system administrator for help' });
                            console.log(err);
                        } else {
                            Languageres.json({message: 'Langauge is created' });
                            console.log('posted')
                        }
                    });
                }
             }
         })
    });
    //Creating a Course
    app.post('/api/course', (req, res) => {
        const CouserName = req.body.coursename;
        const language = req.body.language;
        const coursedescription = req.body.coursedescription;
        
        //Check if language doesnt exist in the database
        var sqlCheck = "SELECT * FROM vambo.courses where coursename = ? and Language = ? ";
        connection.query(sqlCheck, [CouserName,language], (err, results, fields) => {
           if(results.length > 0 ){
                console.log(" Course exist for this Language")
                message = "Course exist for this Language";
                res.json({message: message})
           }else{
            if( req.body.imgURL == null && req.body.imgURLIcon == null){
                 //Insert statement to database
               var sql = "INSERT INTO vambo.courses ( coursename,Language,coursedescription,courseicon,courseimage, Datecreated ) VALUES ?";
               var values =[[CouserName,language,coursedescription,"","",datetime]];
               connection.query(sql, [values], (err, rows) => {
                res.json({message: 'Course is created' });
               });

            } else {
                let courseimage = req.body.imgURL.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
                let courseicon = req.body.imgURLIcon.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
                 // get image size from base64 string
             let responsecourseimage = {}
             let responsecourseicon = {}
             if(courseimage.length !== 3 || courseicon.length !== 3){
             console.log('Something wrong')
             } else {
                 // Convert course image
                responsecourseimage.type = courseimage[1];
                responsecourseimage.data = new Buffer.from(courseimage[2], 'base64');
                let decodeding = responsecourseimage;
                let imageBuffer = decodeding.data;
                let type = decodeding.type;
                let extension = mime.extension(type);
                let fileName = uniqid('courseimage')+'.'+extension;
                fs.writeFileSync('./public/images/'+fileName, imageBuffer, 'utf8');

                //Convert course icon
                responsecourseicon.type = courseicon[1];
                responsecourseicon.data = new Buffer.from(courseicon[2], 'base64');
                let decodedingicon = responsecourseicon;
                let imageBuffericon = decodedingicon.data;
                let typeicon = decodedingicon.type;
                let extensionicon = mime.extension(typeicon);
                let fileNameicon = uniqid('courseicon')+'.'+extensionicon;
                fs.writeFileSync('./public/images/'+fileNameicon, imageBuffericon, 'utf8');

                //Insert statement to database
               var sql = "INSERT INTO vambo.courses ( coursename,Language,coursedescription,courseicon,courseimage, Datecreated ) VALUES ?";
               var values =[[CouserName,language,coursedescription,fileNameicon,fileName,datetime]];
               connection.query(sql, [values], (err, rows) => {
                res.json({message: 'Course is created' });
               });
              }

            }
           }
        })
    });


    //Activate Language
    app.post('/api/LanguageActivate', (req, res) =>{
        var sql = "UPDATE vambo.language SET isActive = ? WHERE Language = ?";
        var values =[[req.body.active, req.body.Language]];
        connection.query(sql,[req.body.active, req.body.Language], (err, rows, fields) => {
            if(err) {
                console.log(err);
            } else {
                console.log('Language chnaged to '+req.body.active);
                res.json({LanguageMessage:  req.body.Language +' is activated'});
                
            }
        })
    })

    //Filter data from Courses by Language
    app.post('/api/filterbyLanguage', (req, res) => {
        console.log(req.body.Language);
        var sqlCheck = "SELECT * FROM vambo.courses where Language = ?";
        connection.query(sqlCheck, [req.body.Language], (err, result, fields) => {
            if(!err) {
                if(results.length > 0 ){
                    let count =JSON.parse(JSON.stringify(result))
                    let storecourses=[];
                    //Looping throw all languages
                    for (var i in result) {
                        var getallcourses= count[i].coursename ;
                        storecourses.push({courses: getallcourses});
                    }
                    res.json(storecourses);
                } else {
                    console.log('Language not found')
                }

            } else {
                console.log(err);
                console.log('error')
            }

        })

    })

    // GetLessonId for a centain Course
    app.post('/api/GetLeesonId', (req, res) => {
        console.log(req.body.Language);
        var sqlCheck = "SELECT * FROM vambo.lessons where Language = ? ";
        connection.query(sqlCheck, [req.body.Language], (err, result, fields) => {
            if(!err) {
                let count =JSON.parse(JSON.stringify(result))
                let storecourses=[];
                //Looping throw all languages
                 for (var i in result) {
                     var getallcourses= count[i].course ;
                     storecourses.push({courses: getallcourses});
                 }
                 res.json(storecourses);

            } else {

            }

        })

    })

    // Get All Started courses for a certain user
    app.post('/api/GetStartedCourses', (req, res)=>{
        console.log(req.body.email)
        var sqlCheck = "SELECT * FROM vambo.startedcourses where email = ? ";
        connection.query (sqlCheck, [req.body.email], (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let startedcourses =[];
               //Looping throw all languages
                for (var i in rows) {
                    var email= count[i].email;
                    var languag = count[i].languag;
                    var coursename = count[i].coursename;
                    var Lesson = count[i].Lesson;
                    var Started_date = count[i].Started_date;
                    startedcourses.push({email: email ,languag: languag, coursename:coursename, Lesson:Lesson , Started_date:Started_date});
                }
                res.json(startedcourses);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });


    // Get All wordAssociation Quiz by LessonId
    //get all data from wordassociation table
    app.post('/api/GetbyLessonIdwordassociation' , (req, res) => {
        var sqlCheck = "SELECT * FROM vambo.wordassociation where LessonID = ? ";
        connection.query (sqlCheck, [req.body.LessonId], (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let wordassociation =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getId= count[i].wordAssociationId;
                    var option1 = count[i].option1;
                    var option2 = count[i].option2;
                    var option3 = count[i].option3;
                    var Answer = count[i].answer;
                    var imagepath =count[i].ImagePath;
                    wordassociation.push({Id: getId ,optionone: option1, optiontwo:option2, optionthree:option3 , Answer:Answer, ImageName:imagepath });
                }
                res.json(wordassociation);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

     // Get All Quizz by LessonId
    //get all data from Quizz table
    app.post('/api/GetbyLessonIdquiz' , (req, res) => {
        var sqlCheck = "SELECT * FROM vambo.quiz where LessonID = ? ";
        connection.query (sqlCheck, [req.body.LessonId], (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let quizz =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getId= count[i].quizId;
                    var option1 = count[i].option1;
                    var option2 = count[i].option2;
                    var imagepath =count[i].ImagePath;
                    quizz.push({Id: getId ,optionone: option1, optiontwo:option2, ImageName:imagepath });
                }
                res.json(quizz);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Filter data from Lesson by Language to get courses
    app.post('/api/filterbyLanguageLesson', (req, res) => {
        console.log(req.body.Language);
        var sqlCheck = "SELECT * FROM vambo.lessons where Language = ?";
        connection.query(sqlCheck, [req.body.Language], (err, result, fields) => {
            if(!err) {
                let count =JSON.parse(JSON.stringify(result))
                let storecourses=[];
                //Looping throw all languages
                 for (var i in result) {
                     var getallcourses= count[i].course ;
                     var getallLessonId= count[i].lessonId ;
                     storecourses.push({courses: getallcourses , LessonID: getallLessonId});
                 }
                 res.json(storecourses);

            } else {

            }

        })

    })

    //Filter Lesson by Course
    app.post('/api/filterLessonsbycourse', (req, res) => {
        console.log(req.body.Course);
        connection.query ('SELECT * FROM vambo.lessons Where course=?',[req.body.Course],(err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storeLessons =[];
               //Looping throw all Lessons
                for (var i in rows) {
                    var getallLesson = count[i].lessonname;
                    var getallLessontype = count[i].lessontype;
                    var getallCourse = count[i].course;
                    var getallLanguage = count[i].Language;
                    storeLessons.push({Lesson: getallLesson, Language: getallLanguage, course:getallCourse, lessontype:getallLessontype });
                }
                console.log('Data is requested');
                res.json(storeLessons);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })

    })

    //Filter Lesson by Language
    app.post('/api/filterLessonsbyLanguage', (req, res) => {
        console.log(req.body.Language);
        connection.query ('SELECT * FROM vambo.lessons Where Language=?',[req.body.Language],(err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storeLessons =[];
               //Looping throw all Lessons
                for (var i in rows) {
                    var getallLesson = count[i].lessonname;
                    var getallCourse = count[i].course;
                    var getallLanguage = count[i].Language;
                    storeLessons.push({Lesson: getallLesson, Language: getallLanguage, course:getallCourse });
                }
                res.json(storeLessons);
                
            }else{
                console.log('Data is not requested');
            }
        })

    })

    //Creating a Lesson
    app.post('/api/lasson', (req, res) => {

      

        //Check if data i want to insert to database is exist
        const LessonName = req.body.Lesson;
        var sqlCheck = "SELECT * FROM vambo.lessons where course = ? and Language = ? and lessonname = ?";
        connection.query(sqlCheck, [req.body.coursename,req.body.language,LessonName], (err, row2, fields) => {
            if (err) {
                console.log(err)
            } else {
                if (row2.length > 0 ) {
                    res.json({message: 'Lesson for this course it is exist, please create another one' , Status: false});
                } else {
                    if( req.body.imgURL == null && req.body.imgURLIcon == null){
                        //Insert statement to database
                        var LessonID = uniqid('Lesson-');
                        var sql = "INSERT INTO vambo.lessons (lessonId, lessonname,lessondescription,lessontype,Language,course,isfree,lessonicon, lessonimage, Datecreated ) VALUES ?";
                        var values =[[LessonID,req.body.Lessonname,req.body.Lessondescription,LessonName, req.body.language,req.body.coursename,'yes', "","", datetime]];
                        connection.query(sql, [values], (err, rows) => {
                            if (err ) {
                                console.log(err)
                            } else {
                                res.json({message: 'Lesson is created' , LessonID: LessonID , Language: req.body.language, CourseName:req.body.coursename, Status: true });
                            }
                                            
                        });
                    } else {

                        let courseimage = req.body.imgURL.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
                        let courseicon = req.body.imgURLIcon.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
                        let responsecourseimage = {}
                        let responsecourseicon = {}
                        if(courseimage.length !== 3 || courseicon.length !== 3){
                        console.log('Something wrong')
                        } else {
                            // Convert course image
                        responsecourseimage.type = courseimage[1];
                        responsecourseimage.data = new Buffer.from(courseimage[2], 'base64');
                        let decodeding = responsecourseimage;
                        let imageBuffer = decodeding.data;
                        let type = decodeding.type;
                        let extension = mime.extension(type);
                        let fileName = uniqid('image')+'.'+extension;
                        fs.writeFileSync('./public/images/'+fileName, imageBuffer, 'utf8');
        
                        //Convert course icon
                        responsecourseicon.type = courseicon[1];
                        responsecourseicon.data = new Buffer.from(courseicon[2], 'base64');
                        let decodedingicon = responsecourseicon;
                        let imageBuffericon = decodedingicon.data;
                        let typeicon = decodedingicon.type;
                        let extensionicon = mime.extension(typeicon);
                        let fileNameicon = uniqid('Lessonicon')+'.'+extensionicon;
                        fs.writeFileSync('./public/images/'+fileNameicon, imageBuffericon, 'utf8');

                        //Insert statement to database
                        var LessonID = uniqid('Lesson-');
                        var sql = "INSERT INTO vambo.lessons (lessonId, lessonname,lessondescription,lessontype,Language,course,isfree,lessonicon, lessonimage, Datecreated ) VALUES ?";
                        var values =[[LessonID,req.body.Lessonname,req.body.Lessondescription,LessonName, req.body.language,req.body.coursename,'yes', fileNameicon,fileName, datetime]];
                        connection.query(sql, [values], (err, rows) => {
                            if (err ) {
                                console.log(err)
                            } else {
                                res.json({message: 'Lesson is created' , LessonID: LessonID , Language: req.body.language, CourseName:req.body.coursename, Status: true });
                            }
                                            
                        });
                        }

                    }

                }
            }
                                
        })
    })
}
