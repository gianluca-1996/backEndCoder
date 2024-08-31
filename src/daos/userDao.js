const userModel = require('../models/userModel.js');

class UserDao{
    
    async createUser(newUser, session){ 
        const user = await userModel(newUser);
        return await user.save(session && { session: session })
    };
    
    async getUserByEmail(email){ return await userModel.findOne({email: email}).lean() };

    async getUserById(id){ return await userModel.findById(id).lean().populate('cart') };

    async getUserByCartId(cid){ return await userModel.findOne({cart: cid}).lean() };

    async updatePassword(email, password){ return await userModel.updateOne({ email: email }, {password: password}) };

    async uploadDocuments(uid, documents){ return await userModel.updateOne({_id: uid}, {$push: {documents: {$each: documents}}}) };

    async uploadRoleToAdmin(id){return await userModel.updateOne({_id: id}, {$set: {role: 'admin'}})};
}

module.exports = new UserDao();