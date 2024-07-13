const ticketModel = require('../models/ticketModel.js');

class TicketDao{
    async saveTicket(purchaseDt, amount, purchaser, detail, session){
        const newTicket = new ticketModel({
            purchaseDt: purchaseDt,
            amount: amount,
            purchaser: purchaser,
            detail: detail
        })
        return await newTicket.save({session});
    }

    async getTicketByPurchaser(email){
        const ticket = await ticketModel.findOne({purchaser: email}).lean();
        return ticket;
    }
}

module.exports = new TicketDao();