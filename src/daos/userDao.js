const userModel = require('../models/userModel.js');

class UserDao{
    
    async createUser(newUser, session){ 
        const user = await userModel(newUser);
        return await user.save(session && { session: session })
    };
    
    async getUserByEmail(email){ return await userModel.findOne({email: email}).lean() };

    async getUserById(id){ return await userModel.findById(id).lean().populate('cart') };
}

module.exports = new UserDao();