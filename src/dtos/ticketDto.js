class TicketDto{
    constructor(ticket){
        this.purchaseDt = ticket.purchaseDt,
        this.amount = ticket.amount,
        this.purchaser = ticket.purchaser,
        this.detail = ticket.detail,
        this.code = ticket.code
    }
}

module.exports = TicketDto;