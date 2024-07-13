const ticketDao = require('../daos/ticketDao.js');
const TicketDto = require('../dtos/ticketDto.js');

class TicketService{
    async saveTicket(purchaseDt, amount, purchaser, detail){
        if(!purchaseDt, !amount, !purchaser, !detail) throw new Error("Debe completar correctamente los campos indicados");
        
        const ticket = await ticketDao.saveTicket(purchaseDt, amount, purchaser, detail);
        if(!ticket) throw new Error("No se pudo realizar la compra");
        return new TicketDto(ticket);
    }

    async getTicketByPurchaser(email){
        if(!email) throw new Error("Debe completar correctamente el email");
        const ticket = await ticketDao.getTicketByPurchaser(email);
        return new TicketDto(ticket);
    }
}

module.exports = new TicketService();