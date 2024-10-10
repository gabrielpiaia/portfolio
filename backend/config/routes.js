module.exports = app => {
    app.route('/users')
    //usa consigne 
    .post(app.api.user.save)
}