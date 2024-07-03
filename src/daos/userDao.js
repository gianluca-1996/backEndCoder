const userModel = require('../models/userModel.js');

class UserDao{
    
    async createUser([newUser], session){ await userModel.create([newUser], { session: session }) };
    
    async getUserByEmail(email){ return await userModel.findOne({email: email}) };

    async getUserById(id){ return await userModel.findById(id).lean().populate('cart') };
}

module.exports = new UserDao();