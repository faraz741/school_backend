const db = require("../utils/database");

module.exports = {


    registerUser: async(user) => {
        return db.query('insert into users set ?', [user]);
    },

    registerbookie: async(savedData) => {
        return db.query('insert into bookie set ?', [savedData]);
    },

    viewByChange: async(setView) => {
        return db.query('insert into view set ? ', [setView]);
    },
    submitStatus: async(race_id, user_id) => {
        
        return db.query('update view set submitStatus= 1 where race_id=? AND user_id=?', [race_id, user_id]);
    },
    viewTable: async(user_id, race_id) => {
      
        return db.query("select view_by from view where user_id =? AND race_id=?", [user_id, race_id]);
    },
    checkForSubmission: async(user_id, race_id) => {
        console.log(race_id);
        return db.query("select submitStatus,view_by from view where user_id =? AND race_id=?", [user_id, race_id]);
    },
    checkSubmitStatus: async(race_id, user_id) => {
        
        return db.query("select submitStatus from view where race_id =? AND user_id=?", [race_id, user_id]);
    },
    fetchcash: async(user_id) => {
        return db.query("select cashInBank from users where id = ?", [user_id]);
    },
    todays_tips: async(savedData) => {
        return db.query('insert into todays_tips set ?', [savedData]);
    },
    fetchTipTenMinBefore: async() => {
        return db.query("select todays_tips.id,race.race_time,race.race_venue,race.race_number,todays_tips. tipTwoRating,todays_tips.tipTwoProbability,todays_tips.tipTwoRating,todays_tips.currentPriceRandR from race inner join todays_tips on race.id=todays_tips.race_id WHERE TIMESTAMP(race.race_date, race.race_time) <= NOW() + INTERVAL 10 MINUTE AND TIMESTAMP(race.race_date, race.race_time) >= NOW()");
    },
    fetchAllTodays_Tips: async(formattedDate) => {
        return db.query("select todays_tips.id,todays_tips.race_id,todays_tips.race_status,race.milisec,race.race_time,race.race_venue,race.race_number,todays_tips. tipTwoRating,todays_tips.tipTwoProbability,todays_tips.tipTwoRating,todays_tips.currentPriceRandR from race inner join todays_tips on race.id=todays_tips.race_id  where race.race_date = ?  order by race.race_time ASC ", [formattedDate]);
    },
    getViewStatus: async(user_id) => {
        return db.query("SELECT * FROM view where view_by=1 AND user_id=?  ", [user_id]);
    },
    checkRaceId: async(gotRaceId) => {
        return db.query("SELECT race_id FROM bettingcard where race_id=?   ", [gotRaceId]);
    },
    fetchRaceByVenue: async(formattedDate) => {
        return db.query("SELECT race_venue,city FROM race where DATE(race_date)=? GROUP BY race_venue, city ", [formattedDate]);
    },
    fetchByVenue: async() => {
        return db.query("SELECT race_venue,city FROM race  GROUP BY race_venue , city");
    },
    fetchRaceByDate: async(formattedDate, race_venue, city) => {
        // console.log("check====>", formattedDate, race_venue);
        return db.query("SELECT * FROM race WHERE DATE(race_date) = ?  AND race_venue=? AND city=?", [formattedDate, race_venue, city]);
    },
    fetchRaceForAll: async(city, race_venue) => {
        
        return db.query("SELECT * FROM race WHERE  city=? AND race_venue=? ", [city, race_venue]);
    },
    updateconfirm_token: async(email, confirm_token) => {
        return db.query('Update users set confirm_token= ? where email=?', [email, confirm_token]);
    },

    update_cashInBank: async(savedData, user_id) => {
       
        return db.query('Update users set cashInBank= ? where id=?', [savedData, user_id]);
    },
    get_cashInBank: async(user_id) => {
        return db.query("select id,cashInBank from users where id = ?", [user_id]);
    },
    get_stake: async(odds) => {
        return db.query("select * from odds where odds = ?", [odds]);
    },
    fetchDetailsById: async(id) => {
        return db.query("select id,name,email,phone,address from users where id = ?", [id]);
    },
    // fetchtime: async() => {
    //     return db.query("SELECT * FROM race WHERE TIMESTAMP(race_date, race_time) <= NOW() + INTERVAL 10 MINUTE AND TIMESTAMP(race_date, race_time) >= NOW()");
    // },
    fetchTipTenMinBefore: async(nownow) => {

        console.log("now===>", nownow);
        return db.query(`select todays_tips.id,todays_tips.race_id from race inner join todays_tips on race.id=todays_tips.race_id WHERE TIMESTAMP(race.race_date, race.race_time) <= '${nownow}' + INTERVAL 10 MINUTE AND TIMESTAMP(race.race_date, race.race_time) >= '${nownow}'`);
    },
    fetchBookiesByUserId: async(user_id) => {
        return db.query("select * from bookie where user_id = ?", [user_id]);
    },
    fetchCountry: async(user_id) => {
        return db.query("select country from users where id = ?", [user_id]);
    },
    bettingCard: async(bet) => {
        return db.query('insert into bettingcard set ?', [bet]);
    },
    transact: async(Entry) => {
        return db.query('insert into transaction set ?', [Entry]);
    },
    get_bettingCard: async(user_id) => {
        return db.query("select * from bettingcard where user_id = ?", [user_id]);
    },
    fetchdate: async() => {
        return db.query("select transaction_id,user_id from transaction where DATE(createdAt) = '2023-09-28' group by user_id");
    },

    fetchBetResults: async(race_id) => {
        return db.query("select horse_name,id as tip_id,result  from todays_tips where race_id=? ", [race_id]);
    },
    fetchCalculations: async(race_id, user_id) => {
        return db.query("select *  from bettingcard where race_id=? AND user_id=? ", [race_id, user_id]);
    },
    fetchUserByEmail: async(email) => {
        return db.query("select * from users where email = ?", [email]);
    },
    fetchUserCommonByEmail: async(email) => {
        return db.query("select id,name,email from users where email = ?", [email]);
    },
    fetchUserByStatus: async(email) => {
        return db.query("select * from users where email = ?", [email]);
    },

    fetchUserByPhone_number: async(phone_number) => {
        return db.query("select * from users where phone_number = ?", [
            phone_number,
        ]);
    },
    updateInvoice: async(newInvoiceNumber, user_id) => {
        console.log(newInvoiceNumber, user_id);
        return db.query("Update transaction set invoice_no= ? where user_id=?", [newInvoiceNumber, user_id]);
    },
    fetchTransactionDetailsById: async(user_id) => {
        return db.query("select * from transaction where user_id = ?", [
            user_id,
        ]);
    },
    updateToken: async(token, email, act_token) => {
        return db.query("Update users set token= ? where email=?", [
            token,
            email,
            act_token,
        ]);
    },

    fetchUserByActToken: async(act_token) => {
        return db.query("select * from users where act_token = ?", [act_token]);
    },



    updateUser: async(token, email) => {
        return db.query("Update users set token=? where email=?", [token, email]);
    },

    updateUserByActToken: async(token, act_token, id) => {
        return db.query(
            `Update users set access_level = 0, token = ?, act_token = ? where id = ?`, [token, act_token, id]
        );
    },



    fetchUserByToken: async(token) => {
        return db.query("select * from users where token = ?", [token]);
    },

    updatePassword: async(password, token) => {
        return db.query("Update users set password= ? where token=?", [
            password,
            token,
        ]);
    },
    update_newpassword: async(password, email) => {
        return db.query("Update users set password= ? where email=?", [
            password,
            email,
        ]);
    },

    fetchUserById: async(id) => {

        return db.query(" select * from users where id= ?", [id]);
    },

    fetchBetCardDetails: async(user_id) => {

        return db.query(" select id ,user_id,investment from bettingcard where user_id= ?", [user_id]);
    },
    fetchUserByIdtoken: async(id) => {

        return db.query(`select * from users where token = '${id}' `, [id]);
    },
    updateVerifyUser: (async(user, id) => {
        return db.query('update users set ? where id = ?', [user, id]);
    }),
    fetchUserBy_Id: async(id) => {
        return db.query(`select * from users where id= '${id}'`, [id]);
    },

    updateUserById: async(user, user_id) => {
        return db.query(
            `Update users SET username='${user.username}' ,profile_image='${user.profile_image}',phone_number='${user.phone_number}' where id='${user_id}' `, [user, user_id]
        );
    },
    updateUserDetailsById: async(setUser, user_id) => {
        return db.query(
            `UPDATE users SET name=?, phone=?, city=?, state=?, postcode=?, date_of_birth=?, country=?, address=? WHERE id=?`, [setUser.name, setUser.phone, setUser.city, setUser.state, setUser.postcode, setUser.date_of_birth, setUser.country, setUser.address, user_id]
        );
    },

    // updateUserById: (async (user,user_id) => {
    //     return db.query(`Update users(username) VALUES('${user.username}')`,
    //      [user.username]);
    // }),

    updateUserbyPass: async(password, user_id) => {
        return db.query("Update users set password=? where  id =?", [
            password,
            user_id,
        ]);
    },
    diaryOneInsert: async(diaryEntry) => {
        return db.query('insert into diary_one set ?', [diaryEntry]);
    },
    diaryTwoInsert: async(diaryEntry) => {
        return db.query('insert into diary_two set ?', [diaryEntry]);
    },
    diaryThreeInsert: async(diaryEntry) => {
        return db.query('insert into diary_three set ?', [diaryEntry]);
    },
    diaryFourInsert: async(diaryEntry) => {
        return db.query('insert into diary_four set ?', [diaryEntry]);
    },
    diaryFiveInsert: async(diaryEntry) => {
        return db.query('insert into diary_five set ?', [diaryEntry]);
    },
    diaryOneUpdate: async(date, bettingPlan, followedPlan, reasonsForDeviation, lessonsLearned, id) => {
        return db.query("Update diary_one set date=?, bettingPlan=?, followedPlan=?, reasonsForDeviation=?, lessonsLearned=? where  id =?", [
            date, bettingPlan, followedPlan, reasonsForDeviation, lessonsLearned,
            id,
        ]);
    },
    diaryTwoUpdate: async(date, plannedWagerAmount, actualWagerAmount, comfortLevel, reasonsForComfortLevel, lessonsLearned, id) => {

        return db.query("Update diary_two set date=?, plannedWagerAmount=?, actualWagerAmount=?, comfortLevel=?, reasonsForComfortLevel=?,lessonsLearned=? where  id =?", [
            date, plannedWagerAmount, actualWagerAmount, comfortLevel, reasonsForComfortLevel, lessonsLearned, id
        ]);
    },
    diaryThreeUpdate: async(date, horseBetting, id) => {
        console.log(horseBetting);
        return db.query("Update diary_three set date=?, horseBetting=? where  id =?", [
            date, horseBetting, id
        ]);
    },
    diaryFourUpdate: async(date, emotionalControl, triggers, actionTaken, lessonsLearned, id) => {

        return db.query("Update diary_four set date=?, emotionalControl=?,triggers=?,actionTaken=?,lessonsLearned=? where  id =?", [
            date, emotionalControl, triggers, actionTaken, lessonsLearned, id
        ]);
    },
    diaryFiveUpdate: async(date, areasOfImprovement, potentialSolutions, actionsTaken, id) => {

        return db.query("Update diary_five set date=?,areasOfImprovement=?,potentialSolutions=?,actionsTaken=? where  id =?", [
            date, areasOfImprovement, potentialSolutions, actionsTaken, id
        ]);
    },
    diaryOneDelete: async(id) => {
        return db.query(`delete  from diary_one where id=?`, [id]);
    },
    diaryTwoDelete: async(id) => {
        return db.query(`delete  from diary_two where id=?`, [id]);
    },
    diaryThreeDelete: async(id) => {
        return db.query(`delete  from diary_three where id=?`, [id]);
    },
    diaryFourDelete: async(id) => {
        return db.query(`delete  from diary_four where id=?`, [id]);
    },
    diaryFiveDelete: async(id) => {
        return db.query(`delete  from diary_five where id=?`, [id]);
    },
    fetchTokenOfUser: async(token) => {
        return db.query("select * from users where token=?", [token]);
    },
    registerContact: async(make) => {
        return db.query('insert into contact set ?', [make]);
    },




    // fetchsignalsANDsymbol: (async (formattedDate,user_id) => {
    //     return db.query('select * from signals where signals_time =? AND user_id=?', [formattedDate,user_id]);
    // }),



    updatePassword_1: async(password, token) => {
        return db.query("Update users set show_password = ? where token=?", [
            password,
            token,
        ]);
    },

    get_all_users: async() => {
        return db.query("select * from users ORDER BY `id` DESC");
    },


    delete_User: async(user_id) => {
        return db.query(`delete  from users where id='${user_id}' `);
    },

    registerUser_1: async(email, username, phone_number, now) => {
        return db.query(
            `insert into users(username,email,phone_number,timezone) VALUES('${username}','${email}','${phone_number}','${now}')`, [username, email, phone_number, now]
        );
    },



    verifyUser: async(user_id) => {
        return db.query(`update users SET verify_user = "1" where id='${user_id}'`);
    },







    delete_actToken: async(user_id) => {
        return db.query(`update users  set act_token = "" where id='${user_id}'`);
    },
    delete_Token: async(token) => {
        return db.query(`update users  set token = "" where id='${token}'`);
    },

    allRaces: async() => {
        return db.query("select * from race ");
    },



    updateUserBy_ActToken: async(token, act_token, email) => {
        return db.query(
            `Update users set verify_user = 1,OTP = 0, token = ?, act_token = ? where email = ?`, [token, act_token, email]
        );
    },
    updateRaceStatus: async(id, value) => {
        return db.query(
            `Update todays_tips set race_status = ? where id = ?`, [value, id]
        );
    },
    getAllRaceData: async(id) => {
        return db.query(
            `select race.*,todays_tips.id as tip_id,todays_tips.horse_name,todays_tips.tipTwoProbability,todays_tips.currentPriceRandR from race inner join todays_tips on race.id=todays_tips.race_id  where race.id = ?`, [id]
        );
    },
    fetchPerformanceStats: async(user_id) => {
        return db.query(
            `SELECT DATE_FORMAT(createdAt,'%Y-%m-%d') AS bet_date, COUNT(*) AS bet_count FROM bettingcard WHERE user_id = ? GROUP BY DATE(createdAt)`, [user_id]
            
        );
    },
    fetchPerformanceByDate: async(user_id,bet_date) => {
        return db.query(
            `SELECT *  FROM bettingcard WHERE user_id= ? AND DATE_FORMAT(createdAt,'%Y-%m-%d')= ?`, [user_id,bet_date]
            
        );
    },
    upcoming: async(currentDateString) => {
        console.log("ccddss", currentDateString)
        return db.query(
            `select  * from race where race_date>?`, [currentDateString]
        );
    },
    fetchSomeStats: async(user_id) => {
        return db.query(
            `select  cashInBank,DATE_FORMAT(created_at,'%Y-%m-%d') from users where id=?`, [user_id]
        );
    },

};