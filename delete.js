module.exports = function (app, connection) {

    //Delete user
    app.delete('/api/users/:id', (req, res) => {
        connection.query('DELETE FROM vambo.lesson WHERE id = ?', [req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('User Record deleted successfully.');
            else
                console.log(err);
            })
    });
}