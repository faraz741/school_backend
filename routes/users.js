const express = require("express");
const userController = require("../controller/userController");
const auth = require("../middleware/auth");
const upload_profile = require("../middleware/upload_profile");

const router = express.Router();

router.post("/signUp", userController.signUp);
router.get("/get_race", userController.get_race);
router.get("/get_details", userController.get_details);
router.get("/get_todays_tips", userController.get_todays_tips);
router.get("/get_cashInBank", userController.get_cashInBank);
router.get("/get_bettingCard", userController.get_bettingCard);
router.get("/get_allRaces", userController.get_allRaces);
router.get("/get_all_bookies", userController.get_all_bookies);
router.get("/fetchTipTenMinBefore", userController.fetchTipTenMinBefore);
router.post("/getStake", userController.getStake);
router.get("/fetchResults/:user_id/:race_id", userController.fetchResults);
router.get("/upcoming_races", userController.upcoming_races);
router.get("/getPerformanceStats/:user_id", userController.getPerformanceStats);

router.post("/viewBy", userController.viewBy);

router.post("/diary_one", userController.diary_one);
router.post("/diary_two", userController.diary_two);
router.post("/diary_three", userController.diary_three);
router.post("/diary_four", userController.diary_four);
router.post("/diary_five", userController.diary_five);

router.post("/updateDiary_one", userController.updateDiary_one);
router.post("/updateDiary_Two", userController.updateDiary_Two);
router.post("/updateDiary_Three", userController.updateDiary_Three);
router.post("/updateDiary_Four", userController.updateDiary_Four);
router.post("/updateDiary_Five", userController.updateDiary_Five);


router.get("/allRaceData/:race_id", userController.get_raceById);


router.post("/setupbookies", userController.setupbookies);
router.post("/sendBettingCard", userController.sendBettingCard);

router.post("/setUpStartingBank", userController.setUpStartingBank);
router.post("/deleteDiaryOne", userController.deleteDiaryOne);
router.post("/deleteDiaryTwo", userController.deleteDiaryTwo);
router.post("/deleteDiaryThree", userController.deleteDiaryThree);
router.post("/deleteDiaryFour", userController.deleteDiaryFour);
router.post("/deleteDiaryFive", userController.deleteDiaryFive);
router.post("/contact", userController.contact);
router.post("/transaction", userController.transaction);
router.get("/getTransaction", userController.getTransaction);
// router.get("/upcoming_races", userController.upcoming_races);

router.post("/login", userController.loginUser);



router.post("/verifyUser", userController.verifyUser);

router.get("/verifyUser/:id", userController.verifyUserEmail);

router.post("/forgotPassword", userController.forgotPassword);
router.post("/setupmydetails", userController.setupmydetails);

router.post("/changeconfirmPassword", userController.changeconfirmPassword);

router.get("/verifyPassword/:token", userController.verifyPassword);

router.post("/changepassword", userController.changepassword);



router.post("/get_all_users", auth, userController.get_all_users);
router.get("/get_allRacesForUsers", userController.get_allRacesForUsers);





router.post("/delete_user", auth, userController.delete_user);



router.post("/change_Password", userController.change_Password);


module.exports = router;