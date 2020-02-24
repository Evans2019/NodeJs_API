module.exports = function (app, connection, jwt) {

     //get all data from sentance construction table
     app.get('/api/updatesentenceconstruction' , (req, res) => {
        connection.query ('SELECT * FROM vambo.sentancecontruction', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let sentancecontruction =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getId= count[i].SCId;
                    var getallfirstsentance = count[i].sentence;
                    var getallsecondsentance = count[i].sentenseconstruction;
                    sentancecontruction.push({Id: getId ,Firstsentance: getallfirstsentance, Secondsentance:getallsecondsentance});
                }
                res.json(sentancecontruction);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Get all data from quiz
    app.get('/api/wordassociation' , (req, res) => {
        connection.query ('SELECT * FROM vambo.wordassociation', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let quiz =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getId= count[i].wordAssociationId;
                    var option1 = count[i].option1;
                    var option2 = count[i].option2;
                    var imagepath =count[i].ImagePath;
                    var option3 =count[i].option3;
                    var Answer =count[i].answer;
                    var lessonname =count[i].lessonname;
                    var AudioPath = count[i].pathaudio;
                    quiz.push({Id: getId ,optionone: option1, optiontwo:option2,optionthree:option3,Answer:Answer,lessonname:lessonname, ImageName:imagepath ,pathaudio:AudioPath });
                }
                res.json(quiz);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

     //get all data from wordassociation table
     app.get('/api/wordassociation' , (req, res) => {
        connection.query ('SELECT * FROM vambo.wordassociation', (err, rows, fields)=>{
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

    //Router to GET specific learner detail from the MySQL database
    app.get('/api/lessons/:id' , (req, res) => {
        connection.query('SELECT * FROM vambo.lesson WHERE id = ?',[req.params.id], (err, rows, fields) => {
            if (!err)
                res.json(rows);
            else
                console.log(err);
        })
    });

    //Get all Active Languages
    app.get('/api/GetActivelanguages' , (req, res) => {
        connection.query ('SELECT * FROM vambo.language', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storelanguages =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getallLanguages = count[i].Language;
                    storelanguages.push({Language: getallLanguages});
                }
                res.json(storelanguages);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Displaying all data from language Table
    app.get('/api/languagesData' , (req, res) => {
        connection.query ('SELECT DISTINCT Language FROM vambo.courses GROUP BY Language ', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storelanguages =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getallLanguages = count[i].Language;
                    storelanguages.push({Language: getallLanguages});
                }
                res.json(storelanguages);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Displaying all data from Lesson to load on user screen 
    app.get('/api/languagesLesson' , (req, res) => {
        connection.query ('SELECT DISTINCT Language FROM vambo.lessons GROUP BY Language ', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storelanguages =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getallLanguages = count[i].Language;
                    var getallLessonID = count[i].lessonId;
                    storelanguages.push({Language: getallLanguages, LessonId:getallLessonID});
                }
                res.json(storelanguages);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });


    //Displaying all data from language Table
    app.get('/api/languages' , (req, res) => {
        connection.query ('SELECT * FROM vambo.language', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storelanguages =[];
               //Looping throw all languages
                for (var i in rows) {
                    var getallLanguages = count[i].Language;
                    var Isactive = count[i].isActive;
                    storelanguages.push({Language: getallLanguages, isActive: Isactive});
                }
                res.json(storelanguages);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });
    
     //Displaying all data from Lesson Table
     app.get('/api/Lessons' , (req, res) => {
        connection.query ('SELECT * FROM vambo.lessons', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storeLessons =[];
               //Looping throw all Lessons
                for (var i in rows) {
                    var getallLessonId = count[i].lessonId;
                    var getallLessontype = count[i].lessontype;
                    var getallLessondescription = count[i].lessondescription;
                    var getallLesson = count[i].lessonname;
                    var getallCourse = count[i].course;
                    var getallLanguage = count[i].Language;
                    storeLessons.push({lessonId: getallLessonId, Lesson: getallLesson, Language: getallLanguage, course:getallCourse , lessontype: getallLessontype ,lessondescription: getallLessondescription });
                }
                res.json(storeLessons);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Email Verification
    app.get('/api/verification' , (req, res) => {
        console.log(req.query.token);
        console.log('Link from the email is clicked');
        //Verify if token is for correct email
        jwt.verify(req.query.token, process.env.ACCESS_TOKEN_SECRET, function (err, payload) {
            if (err) {
                console.log('Token is not correct');
            } else {
                
                var sql = "UPDATE vambo.users SET isVerified =true WHERE Email = ?";
                connection.query(sql,[payload.email], (err, rows, fields) => {
                    if(err) {
                        console.log('Not Updated');
                    } else {
                        console.log('Updated');
                        res.writeHead(301,
                        {Location: 'http://167.71.93.67/#/home'}
                        );
                        res.end();
                    }
                })

            }
        })
    });
    
    // Get Word Association
    app.get('/api/getWordassociation' , (req, res) => {
        connection.query ('SELECT * FROM vambo.quiz', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let wordassociation =[];
               //Looping throw all languagess
                for (var i in rows) {
                    var getId= count[i].quizId;
                    var option1 = count[i].option1;
                    var option2 = count[i].option2;
                    var pathaudio = count[i].AudioPath;
                    var imagepath = count[i].ImagePath;
                    wordassociation.push({Id: getId ,optionone: option1, optiontwo:option2, ImageName:imagepath ,pathaudio: pathaudio });
                }
                res.json(wordassociation);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })

    })

    //Displaying all data from course Table
    app.get('/api/courses' , (req, res) => {
        connection.query ('SELECT * FROM vambo.courses', (err, rows, fields)=>{
            if(!err){
               let count =JSON.parse(JSON.stringify(rows))
               let storecourses=[];
               //Looping throw all languages
                for (var i in rows) {
                    var getallcourses= count[i].coursename ;
                    var getallLanguages= count[i].Language  ;
                    storecourses.push({courses: getallcourses, Language: getallLanguages});
                }
                res.json(storecourses);
                
            }else{
                console.log(err);
                console.log('Data is not requested');
            }
        })
    });

    //Router to GET specific language detail from the MySQL database
    app.get('/api/language/:id' , (req, res) => {
        connection.query('SELECT * FROM vambo.language WHERE id = ?',[req.params.id], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    });

    //Router to GET specific User detail by email from the MySQL database
    app.get('/api/users/:id' , (req, res) => {
        connection.query('SELECT * FROM vambo.users WHERE Email = ?',[req.params.id], (err, rows, fields) => {
            if (!err){
                res.send(rows);
            }else{
                console.log(err);
            }   
        })
    });

}