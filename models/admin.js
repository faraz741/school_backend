const db = require("../utils/database");

module.exports = {
    getAllAdminRaceData: async(id) => {
        return db.query(
            `select * from race  where race.id = ?`, [id]
        );
    },
    registerrace: async(race) => {
        return db.query('insert into race set ?', [race]);
    },
    allRaces: async() => {
        return db.query("select * from race ");
    },
    getTipsByRace: async(race_id) => {
        return db.query("select todays_tips.*,race.race_time,race.race_number,race.bet_number from todays_tips inner join race on race.id=todays_tips.race_id where race_id=? ", [race_id]);
    },
    todays_tips: async(savedData) => {
        return db.query('insert into todays_tips set ?', [savedData]);
    },
    fetchAllTodays_Tips: async(formattedDate) => {
        return db.query("select todays_tips.id,todays_tips.horse_name,todays_tips.race_id,todays_tips.race_status,race.milisec,race.race_time,race.race_venue,race.race_number,todays_tips. tipTwoRating,todays_tips.tipTwoProbability,todays_tips.tipTwoRating,todays_tips.currentPriceRandR from race inner join todays_tips on race.id=todays_tips.race_id  where race.race_date = ?  order by race.race_time ASC ", [formattedDate]);
    },
    fetchAllTips: async() => {
        return db.query("select todays_tips.id,todays_tips.horse_name,todays_tips.race_id,todays_tips.race_status,race.milisec,race.race_time,race.race_venue,race.race_number,todays_tips. tipTwoRating,todays_tips.tipTwoProbability,todays_tips.tipTwoRating,todays_tips.currentPriceRandR from race inner join todays_tips on race.id=todays_tips.race_id    order by race.race_time ASC");
    },
    fetchRaceId: async(race_id) => {
        return db.query("select * from todays_tips where race_id=?", [race_id]);
    },
    updateTipsDetailsById: async(dataToSave, tip_id) => {
        return db.query(
            `UPDATE todays_tips SET horse_name=?, tipTwoRating=?, tipTwoProbability=?, currentPriceRandR=?  WHERE id=?`, [dataToSave.horse_name, dataToSave.tipTwoRating, dataToSave.tipTwoProbability, dataToSave.currentPriceRandR, tip_id]
        );
    },
    deleteTip: async(id) => {
        return db.query(`delete  from todays_tips where id=?`, [id]);
    },
    deleteRace: async(id) => {
        return db.query(`delete  from race where id=?`, [id]);
    },
    fetchTip: async(id) => {
        return db.query(`select *  from todays_tips where id=?`, [id]);
    },
    resultdeclare: async(declare, id) => {
        return db.query('update todays_tips set result= ? where id=?', [declare, id]);
    },
    resultStatus: async(id) => {
        return db.query('update race set result_status= 1 where id=?', [id]);
    },
    declareToUser: async(result, id) => {
        
        return db.query('update bettingcard set win_lose=? where tip_id=? ', [result, id]);
    },
    fetchUserByEmail: async(email) => {
        return db.query("select * from admin  where email = ?", [email]);
    },
    fetchUserCommonByEmail: async(email) => {
        return db.query("select id,email from admin where email = ?", [email]);
    },
    updateToken: async(token, email, act_token) => {
        return db.query("Update users set token= ? where email=?", [
            token,
            email,
            act_token,
        ]);
    },
    getDataToCalc: async(race_id) => {
        return db.query("select * from bettingcard where race_id=?", [race_id]);
    },
    postCalculation: async(difference, id) => {
        
        return db.query('update bettingcard set difference=? where id=? ', [difference, id]);
    },
    getUserId: async(race_id) => {
        return db.query("select distinct(user_id) from bettingcard where race_id=? ", [race_id]);
    },
    getUserData: async(race_id, user_id) => {
        return db.query("select * from bettingcard where race_id=? AND  user_id=?", [race_id, user_id]);
    },
    postProfit: async(profit, id,user_id) => {
        return db.query('update bettingcard set profit=? where race_id=? AND  user_id=? ', [profit, id,user_id]);
    },
};