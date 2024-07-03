const userService = require('../services/userService.js');

class UserController{
    async createUser(req, res){
        try {
            const user = userService.createUser(req.body);
            res.status(201).json( {result: "success", payload: user} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }
}

module.exports = new UserController();