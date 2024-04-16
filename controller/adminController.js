const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const localStorage = require("localStorage");
var base64url = require("base64url");
var crypto = require("crypto");
const moment = require("moment");
const fs = require("fs");
const axios = require("axios");
require("moment-timezone");
const config = require("../config");
const JWT_SECRET = 'your_secret_key';



const saltRounds = 10;

const {
    getAllAdminRaceData,
    registerrace,
    allRaces,
    todays_tips,
    fetchAllTodays_Tips,
    fetchAllTips,
    fetchRaceId,
    resultStatus,
    updateTipsDetailsById,
    deleteTip,
    deleteRace,
    fetchTip,
    getTipsByRace,
    resultdeclare,
    declareToUser,
    fetchUserCommonByEmail,
    fetchUserByEmail,
    getDataToCalc,
    postCalculation,
    getUserId,
    getUserData,
    postProfit,
} = require("../models/admin");

const { getData, insertData, createDataBase } = require("../models/common")


exports.schoolRegister = async (req, res) => {
    try {
        const { owners_name, phone_no, school_name, address, school_reg_id, district, pincode } = req.body;
     
        const bodyData = {
            owners_name: owners_name,
            phone_no: phone_no,
            school_name: school_name,
            address: address,
            school_reg_id: school_reg_id,
            district: district,
            pincode: pincode
        };
        const adminData = {
            phone_no: phone_no,
            database_name: school_name
        };

        const schema = Joi.alternatives(
            Joi.object({
                owners_name: [Joi.string().empty().required()],
                phone_no: [Joi.string().empty().required()],
                school_name: [Joi.string().empty().required()],
                address: [Joi.string().empty().required()],
                school_reg_id: [Joi.string().empty().required()],
                district: [Joi.string().empty().required()],
                pincode: [Joi.string().empty().required()],
            })
        );
        const result = schema.validate({ owners_name, phone_no, school_name, address, school_reg_id, district, pincode });
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,
                success: false,
            });
        } else {
            const data = await getData('school_management', 'schools', `where phone_no = ${phone_no}`);
            console.log(data)
            if ( data != undefined) {
                return res.json({
                    success: false,
                    message: "Already have account, Please Login",
                    status: 400,
                });
            } else {

                console.log(adminData)
                    const insertDataResult = await insertData('school_management', 'schools', adminData);
                    console.group("insertData", insertDataResult )
                    if (insertDataResult.affectedRows >0) {
                        const createDatabases = await createDataBase(school_name);
                        return res.json({
                            success: false,
                            message: "account created, Please Login",
                            status: 400,
                        });
                    }
                 else {
                    return res.json({
                        message: "user add failed",
                        status: 400,
                        success: false,
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500,
            error: error,
        });
    }
};











