const db = require("../utils/database");

module.exports = {
    save_CARD: (async(token_id, card_id, customer_id, user_id) => {
        return db.query(`insert into cards set user_id='${user_id}' , card_id ='${card_id}' , customer_id ='${customer_id}',token_id ='${token_id}' `);
    }),
    postSuccess: async(id) => {
        return db.query('update bettingcard set payment_status	= ? where user_id=?', [id]);
    },
};