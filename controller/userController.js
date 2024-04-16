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






const dtf = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' });
const { timeZone } = dtf.resolvedOptions();

// const moment = require('moment-timezone');
moment.tz.setDefault(timeZone);



function generateAuthToken(user) {

    const payload = {
        user_id: user.id,
        email: user.email,
    };


    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return token;
}
const {
    registerUser,
    registerrace,
    registerbookie,
    declareToUser,
    todays_tips,
    fetchRaceByDate,
    update_cashInBank,
    get_cashInBank,
    fetchPerformanceByDate,
    fetchcash,
    get_stake,
    fetchCountry,
    bettingCard,
    allRaces,
    get_bettingCard,
    checkSubmitStatus,
    fetchByVenue,
    fetchRaceForAll,
    resultdeclare,
    checkForSubmission,
    fetchBetResults,
    fetchCalculations,
    viewTable,
    getViewStatus,
    checkRaceId,
    submitStatus,
    fetchBetCardDetails,
    transact,
    fetchdate,
    fetchTransactionDetailsById,
    fetchtime,
    fetchTodays_Tips,
    fetchTipTenMinBefore,
    viewByChange,
    updateInvoice,
    fetchDetailsById,
    fetchAllTodays_Tips,
    fetchBookiesByUserId,
    fetchRaceByVenue,
    updateUserDetailsById,
    fetchSomeStats,
    diaryOneInsert,
    diaryTwoInsert,
    diaryThreeInsert,
    updateRaceStatus,
    diaryFourInsert,
    diaryFiveInsert,
    diaryOneUpdate,
    diaryTwoUpdate,
    diaryThreeUpdate,
    diaryFourUpdate,
    diaryFiveUpdate,
    diaryOneDelete,
    diaryTwoDelete,
    diaryThreeDelete,
    diaryFourDelete,
    diaryFiveDelete,
    get_all_users,
    registerContact,
    delete_Token,
    delete_User,
    fetchPerformanceStats,
    updateUserBy_ActToken,
    fetchUserByToken,
    updatePassword,
    updatePassword_1,
    fetchUserByEmail,
    fetchUserCommonByEmail,
    updateUser,
    updateToken,
    fetchUserByActToken,
    updateUserByActToken,
    fetchUserById,
    fetchUserByIdtoken,
    getAllRaceData,
    update_newpassword,
    upcoming,
} = require("../models/users");
const { timeStamp } = require("console");



const baseurl = config.base_url;
const base_url_angular = config.base_url_angular;

function generateRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const saltRounds = 10;

const complexityOptions = {
    min: 8,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
};




function generateToken() {
    var length = 6,
        charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function generateOTP(length = 8) {
    const chars = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        OTP += chars.charAt(randomIndex);
    }

    return OTP;
}


// Usage example

var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    // secure: true,
    auth: {
        user: "tiptwo02@gmail.com",
        pass: "ycfdfshysdnaygaj",
    },
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve(__dirname + "/view/"),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname + "/view/"),
};

transporter.use("compile", hbs(handlebarOptions));

exports.signUp = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const act_token = generateRandomString(8);

        const schema = Joi.alternatives(
            Joi.object({
                name: [Joi.string().empty().required()],
                email: [
                    Joi.string()
                    .min(5)
                    .max(255)
                    .email({ tlds: { allow: false } })
                    .lowercase()
                    .required(),
                ],
                // password: passwordComplexity(complexityOptions),
                password: Joi.string().min(8).max(15).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 15 values allowed",
                }),
            })
        );
        const result = schema.validate({ name, email, password });
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
            const data = await fetchUserByEmail(email);
            if (data.length !== 0) {
                return res.json({
                    success: false,
                    message: "Already have account, Please Login",
                    status: 400,
                });
            } else {

                if (!result.error) {
                    let mailOptions = {
                        from: "tiptwo02@gmail.com",
                        to: email,
                        subject: "Activate Account",
                        template: "signupemail",
                        context: {

                            href_url: `${baseurl}/verifyUser/${encodeURIComponent(act_token)}`,
                            image_logo: baseurl + `/image/Header_logo.png`,
                            msg: `${baseurl}/verifyUser/${encodeURIComponent(act_token)}`,
                            message: 'Your account has been created successfully and is ready to use.'

                        },

                    };
                    transporter.sendMail(mailOptions, async function(error, info) {
                        if (error) {
                            console.log(error);
                            return res.json({
                                success: false,
                                status: 400,
                                message: "Mail Not delivered",
                            });
                        } else {
                            const hash = await bcrypt.hash(password, saltRounds);

                            const user = {
                                name: name,
                                email: email,
                                password: hash,
                                act_token: act_token
                            };
                            const create_user = await registerUser(user);
                            return res.json({
                                success: true,
                                message: "Please verify your account with the email we have sent  to your email address  " +
                                    `${email}`,
                                status: 200,
                            });
                        }
                    });
                } else {
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





exports.verifyUser = async(req, res) => {
    try {
        const { token, act_token } = req.body;
        // console.log("my token:   ------------------------------", token);
        const schema = Joi.alternatives(
            Joi.object({
                token: Joi.string().empty().required().messages({
                    "string.required": "token is required",
                }),
                act_token: Joi.string().empty().required().messages({
                    "string.required": "act_token is required",
                }),
            })
        );
        const result = schema.validate({ token, act_token });
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
            const data = await fetchUserByActToken(act_token);
            if (data.length !== 0) {
                let datas = {
                    act_token: "",
                    status: true,
                };

                const result = await updateUserByActToken(
                    token,
                    datas.act_token,
                    data[0] ? data[0].id : undefined
                );
                if (result.affectedRows) {
                    return res.json({
                        success: true,
                        message: "Email verified successfully! You can now log in.",
                        status: 200,
                    });
                }
            } else {
                return res.json({
                    success: false,
                    message: "Error verifying email.",
                    status: 400,
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
        });
    }
};

exports.verifyUserEmail = async(req, res) => {
    try {
        const act_token = req.params.id;
        const token = generateToken();
        if (!act_token) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,
                success: false,
            });
        } else {
            const data = await fetchUserByActToken(act_token);
            // console.log(req.params.token);
            if (data.length !== 0) {
                let datas = {
                    act_token: "",
                    status: true,
                };
                const hash = await bcrypt.hash(token, saltRounds);
                const result = await updateUserByActToken(
                    hash,
                    datas.act_token,
                    data[0] ? data[0].id : undefined
                );

                if (result.affectedRows) {
                    res.sendFile(__dirname + "/view/verify.html");
                } else {
                    res.sendFile(__dirname + "/view/notverify.html");
                }
            } else {
                res.sendFile(__dirname + "/view/notverify.html");
            }
        }
    } catch (error) {
        console.log(error);
        res.send(`<div class="container">
        <p>404 Error, Page Not Found</p>
        </div> `);
    }
};

exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const token = generateToken();
        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.string().empty().required()],
                password: Joi.string().min(8).max(15).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 15 values allowed",
                }),
            })
        );
        const result = schema.validate({ email, password });

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


            const data = await fetchUserByEmail(email);

            const data2 = await fetchUserCommonByEmail(email);
            if (data.length !== 0) {
                if (data[0].act_token === "" && data[0].access_level === 0) {
                    if (email === data[0].email) {
                        // const match = bcrypt.compareSync(password, data[0].password);
                        const match = bcrypt.compareSync(password, data[0].password);
                        // console.log(">>>>>>>>>", match);
                        if (match) {
                            const toke = jwt.sign({
                                    data: {
                                        id: data[0].id,
                                    },
                                },
                                "SecretKey", { expiresIn: "1d" }
                            );
                            // console.log(toke);
                            bcrypt.genSalt(saltRounds, async function(err, salt) {
                                bcrypt.hash(token, salt, async function(err, hash) {
                                    if (err) throw err;
                                    const results = await updateToken(hash, email);

                                    return res.json({
                                        status: 200,
                                        success: true,
                                        message: "Login successful!",
                                        token: toke,
                                        user_info: data2[0],
                                    });
                                });
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: "Invalid password.",
                                status: 400,
                            });
                        }
                    } else {
                        return res.json({
                            message: "Account not found. Please check your details",
                            status: 400,
                            success: false,
                        });
                    }
                } else {
                    return res.json({
                        message: "Login failed. Please verify your account and try again",
                        status: 400,
                        success: false,
                    });
                }
            } else {
                return res.json({
                    success: false,
                    message: "Account not found. Please check your details.",
                    status: 400,
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error,
        });
    }
};

exports.resetPassword = async(req, res) => {
    const { user_id, password } = req.body;
    try {
        const schema = Joi.alternatives(
            Joi.object({
                password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                user_id: Joi.number().empty().required().messages({
                    "number.empty": "id can't be empty",
                    "number.required": "id  is required",
                }),
            })
        );
        const result = schema.validate(req.body);

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
            const result = await fetchUserById(user_id);
            if (result.length != 0) {
                const hash = await bcrypt.hash(password, saltRounds);
                const result2 = await updateUserbyPass(hash, user_id);

                if (result2) {
                    return res.json({
                        success: true,
                        status: 200,

                        message: "Password reset successful. You can now log in with your new password",
                    });
                } else {
                    return res.json({
                        success: false,
                        status: 200,
                        message: "Some error occured. Please try again",
                    });
                }
            } else {
                return res.json({
                    success: false,
                    status: 200,
                    message: "User Not Found",
                });
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

function randomStringAsBase64Url(size) {
    return base64url(crypto.randomBytes(size));
}

exports.forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;

        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.string().empty().required()],
            })
        );
        const result = schema.validate({ email });
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
            const data = await fetchUserByEmail(email);
            if (data.length !== 0) {
                const genToken = randomStringAsBase64Url(20);
                await updateUser(genToken, email);

                const result = await fetchUserByEmail(email);

                let token = result[0].token;

                if (!result.error) {
                    let mailOptions = {
                        from: "tiptwo02@gmail.com",
                        to: req.body.email,
                        subject: "Forget Password",
                        template: "forget_template",
                        context: {
                            href_url: `${base_url_angular}/confirmPassword/${token}`,
                            msg: `Please click below link to change password.`,
                        },
                    };
                    transporter.sendMail(mailOptions, async function(error, info) {
                        if (error) {
                            return res.json({
                                success: false,
                                message: error,
                            });
                        } else {

                            return res.json({
                                success: true,

                                message: "Password reset link sent successfully. Please check your email " +
                                    email,
                            });
                        }
                    });
                }
            } else {
                return res.json({
                    success: false,

                    message: "Email address not found. Please enter a valid email",
                    status: 400,
                });
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
exports.changepassword = async(req, res) => {
    const { email, new_password, password } = req.body;
    try {


        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.string().empty().required()],
                new_password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                })

            })
        );
        const result = schema.validate(req.body);
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
            const data = await fetchUserByEmail(email);
            const match = bcrypt.compareSync(password, data[0].password);

            if (data.length !== 0) {

                if (match) {

                    const hash = await bcrypt.hash(new_password, saltRounds);
                    const result2 = await update_newpassword(hash, email);
                    if (result2) {
                        return res.json({
                            status: 200,
                            success: true,
                            message: "Password changed",

                        });
                    }
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
exports.verifyPassword = async(req, res) => {
    try {
        const id = req.params.token;

        // console.log(id);

        if (!id) {
            return res.status(400).send("Invalid link");
        } else {
            const result = await fetchUserByIdtoken(id);

            console.log(">>>>>>>>>>", result);

            const token = result[0].token;
            if (result.length !== 0) {
                // localStorage.setItem("vertoken", JSON.stringify(token));

                res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
                    msg: "",
                });
            } else {
                res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
                    msg: "This User is not Registered",
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
    }
};

exports.changeconfirmPassword = async(req, res) => {
    try {
        const { token, password, confirm_password } = req.body;

        // const token = JSON.parse(localStorage.getItem("vertoken"));
        const schema = Joi.alternatives(
            Joi.object({
                password: Joi.string().min(8).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                confirm_password: Joi.string().min(8).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 10 values allowed",
                }),
            })
        );
        const result = schema.validate({ password, confirm_password });
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
            if (password == confirm_password) {
                const data = await fetchUserByToken(token);

                if (data.length !== 0) {
                    // const update_show_password = await updatePassword_1(password, token);
                    const hash = await bcrypt.hash(password, saltRounds);
                    const result2 = await updatePassword(hash, token);
                    console.log(result2);
                    const respo = delete_Token(token);
                    if (result2.affectedRows === 1) {
                        return res.json({
                            message: "Password Updated Successfully",
                            success: true,
                            status: 200,
                        });
                    } else {
                        return res.json({
                            message: "Unable to change password.",
                            success: false,
                            status: 401,
                        });
                    }
                } else {
                    return res.json({
                        message: "User not found please sign-up first",
                        success: false,
                        status: 402,
                    });
                }
            } else {
                return res.json({
                    message: "Password didn't matched",
                    success: false,
                    status: 400,
                });
            }
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
};

exports.sendBettingCard = async(req, res) => {
    try {
        const bettingCard_1 = JSON.parse(req.body.bettingCard_1);
        
        // const bettingCard_1 = req.body.bettingCard_1;
        const bettingCard_2 = JSON.parse(req.body.bettingCard_2);
        // const bettingCard_2 = req.body.bettingCard_2;

        const bet_1 = {
            user_id: bettingCard_1[0].user_id,
            race_id: bettingCard_1[0].race_id,
            tip_id: bettingCard_1[0].tip_1,
            cashInBank: bettingCard_1[0].cashInBank,
            bookieId: bettingCard_1[0].bookieOneId,
            betAmount: bettingCard_1[0].betAmount_1,
            returnVal: bettingCard_1[0].return_1,
            bonus_bet: bettingCard_1[0].bonus_bet_1
        };

        const bet_2 = {
            user_id: bettingCard_2[0].user_id,
            race_id: bettingCard_2[0].race_id,
            tip_id: bettingCard_2[0].tip_2,
            cashInBank: bettingCard_2[0].cashInBank,
            bookieId: bettingCard_2[0].bookieTwoId,
            betAmount: bettingCard_2[0].betAmount_2,
            returnVal: bettingCard_2[0].return_2,
            bonus_bet: bettingCard_2[0].bonus_bet_2
        };

        const check = await checkSubmitStatus(bet_1.race_id, bet_1.user_id);
        if (check[0].submitStatus === 1) {
            return res.status(200).json({
                success: false,
                message: "Betting Card Sent Already",

            });
        } else {
            const result = await bettingCard(bet_1);
            const result_2 = await bettingCard(bet_2);
            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "Unable to Send Betting Card",
                });
            } else {
                const results = await submitStatus(bet_1.race_id, bet_1.user_id);
                // console.log(results);
                return res.status(200).json({
                    success: true,
                    message: "Betting Card Saved successfully"
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_bettingCard = async(req, res) => {
    try {
        const user_id = req.query;
        // console.log('id========>>>>', user_id.user);
        const result = await get_bettingCard(user_id.user);

        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "Unable to get betting card",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "betting card found",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.viewBy = async(req, res) => {
    try {

        const { user_id, race_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().required(),
                race_id: Joi.number().required(),

            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const setView = {
                race_id: race_id,
                user_id: user_id,
                view_by: 1,
            };
            const checkView_by = await viewTable(user_id, race_id);
            if (checkView_by.length > 0) {
                return
            } else {
                const result2 = await viewByChange(setView);
                if (result2.affectedRows > 0) {
                    return res.status(200).json({
                        success: true,
                        message: "viewed successfully",

                    });
                } else {
                    return res.status.json({
                        success: false,
                        message: "Not Viewed",

                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_allRaces = async(req, res) => {
    try {

        // const result = await allRaces();
        const result = await fetchByVenue();

        await Promise.all(result.map(async(item) => {

            // console.log("item====>", item);
            const response = await fetchRaceForAll(item.city, item.race_venue);

            if (response.length > 0) {
                item.race_data = response;
            } else {
                item.race_data = [];
            }

        }));

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Races fetched successfully",
                data: result, // You can customize this part
            });
        } else {
            return res.json({
                success: false,
                message: "Unable to fetch races",
                status: 400,
                data: "Invalid race date",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.setupmydetails = async(req, res) => {
    const { user_id } = req.body;
    try {
        const {
            name,
            phone,
            country,
            city,
            state,
            postcode,
            date_of_birth,
            address
        } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().required(),
                name: [Joi.string().empty().required()],
                phone: Joi.string()
                    .empty()
                    .pattern(/^[0-9]{10}$/) // Example: 10-digit phone number
                    .required(),
                city: Joi.string().empty().required(),
                state: Joi.string().empty().required(),
                postcode: Joi.string()
                    .empty()
                    .required(),
                date_of_birth: Joi.date().required(),
                country: Joi.string().empty().required(),
                address: Joi.string().empty().required(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const setUser = {
                name: name,
                phone: phone,
                city: city,
                state: state,
                postcode: postcode,
                date_of_birth: date_of_birth,
                country: country,
                address: address
            };
            const result = await updateUserDetailsById(setUser, user_id);
            return res.status(200).json({
                success: true,
                message: "Data validated and processed successfully",
                data: setUser,
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.setUpStartingBank = async(req, res) => {
    try {
        const {
            user_id,
            cashInBank,
        } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().required(),
                cashInBank: Joi.number().required(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const pre_cash = await fetchcash(user_id);
            // console.log(pre_cash);
            // const cash = cashInBank + pre_cash[0];
            if (Array.isArray(pre_cash) && pre_cash.length > 0) {
                // Access the 'cashInBank' property within the first object in the array
                const previousCashInBank = pre_cash[0].cashInBank;

                // Calculate the new cash amount
                const cash = parseInt(cashInBank) + parseInt(previousCashInBank);
                // console.log("add====>", cash);

                const respo = await update_cashInBank(cash, user_id);
                // console.log(respo);
                if (respo.error) {
                    return res.json({
                        success: false,
                        message: "No User found",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "Starting bank set up successfull.",
                        data: cash,
                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}

exports.fetchResults = async(req, res) => {
    try {
        const {
            user_id,
            race_id,
        } = req.params;
        const check = await checkForSubmission(user_id, race_id)
        if (check.length > 0) {
            if (check[0].submitStatus == 1) {

                const allBetData = await fetchBetResults(race_id)
                if (allBetData[0].result === null) {
                    return res.json({
                        success: false,
                        message: "Result is not declared yet",
                    });
                }

                if (allBetData.length === 0) {
                    // User not found
                    return res.json({
                        success: false,
                        message: "Unable to fetch results",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "Results and profit got successfully for the user",
                        data: allBetData,
                        // calculate: calculate,
                    });
                    // User found
                    // const calculate = await fetchCalculations(race_id, user_id)
                    // if (calculate.length === 0) {
                    //     // User not found
                    //     return res.json({
                    //         success: false,
                    //         message: "Unable to fetch profit for this user",
                    //     });
                    // } else {
                     
                    // }
                }
            }
        } else {
            return res.status(200).json({
                success: false,
                message: "Unable to fetch results",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_cashInBank = async(req, res) => {
    try {
        const user_id = req.query;
        const result = await get_cashInBank(user_id.user);
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "Unable to know amount of cash in bank",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "Amount of cash found successfully",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.setupbookies = async(req, res) => {
    try {
        const {
            user_id,
            bookie_name,
            bookie_amount
        } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().required(),
                bookie_name: [Joi.string().empty().required()],
                bookie_amount: Joi.number().required(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const savedData = {
                user_id: user_id,
                bookie_name: bookie_name,
                bookie_amount: bookie_amount,
            };
            const result = await registerbookie(savedData);
            return res.status(200).json({
                success: true,
                message: "Bookie data saved successfully.",
                data: savedData,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_all_bookies = async(req, res) => {
    try {
        const user_id = req.query.user;
        const result = await fetchBookiesByUserId(user_id);
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "Unable to find bookies by that id",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "All bookies fetched successfully",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_details = async(req, res) => {
    try {
        const user_id = req.query.user;


        // console.log('id========>>>>', user_id);
        const result = await fetchDetailsById(user_id);

        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "User not found",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "User found",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
};





// exports.upcoming_races = async(req, res) => {
//     try {


//         const query = await fetchtime();

//         console.log(query);
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "An internal server error occurred. Please try again later.",
//             status: 500,
//             error: error.message,
//         });
//     }
// }
// Create a DateTimeFormat object with the timezone option set to "short".

exports.transaction = async(req, res) => {
    try {
        const {
            user_id,
            investment,
            bettingCard_id,
            transaction_id,
            profit,
            roi,
            commission
        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            bettingCard_id: Joi.number().required(),
            transaction_id: Joi.number().required(),
            investment: Joi.string().required(),
            profit: Joi.string().required(),
            roi: Joi.string().required(),
            commission: Joi.string().allow(''),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.status(400).json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const Entry = {
                user_id: user_id,
                investment: investment,
                transaction_id: transaction_id,
                bettingCard_id: bettingCard_id,
                profit: profit,
                roi: roi,
                commission: commission,

            };

            function generateInvoiceNumber(prefix, currentNumber) {
                const nextNumber = currentNumber + 1;
                const invoiceNumber = `${prefix}-${nextNumber}`;
                return invoiceNumber;
            }
            const currentInvoiceNumber = 1000;
            const prefix = 'TipTwo';
            const newInvoiceNumber = generateInvoiceNumber(prefix, currentInvoiceNumber);
            const use = await fetchdate();
            // console.log(use[0].user_id);
            const update = await updateInvoice(newInvoiceNumber, use[0].user_id);

            // console.log('New Invoice Number:', newInvoiceNumber);
            const result2 = await transact(Entry);
            // const result = await fetchBetCardDetails(user_id);
            // console.log(result2);
            if (result2.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Details Fetched successfully',
                    data: result2,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to Fetch",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.getTransaction = async(req, res) => {
    try {
        const user_id = req.query.user_id;


        // console.log('id========>>>>', user_id);
        const result = await fetchTransactionDetailsById(user_id);
        // console.log(result);
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "User's Transaction not found",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "User's Transaction found",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.fetchTipTenMinBefore = async(req, res) => {
    try {
        const user_id = req.query.user_id;
        const status = await getViewStatus(user_id);

        if (status.length > 0) {
            let lastElement = status[status.length - 1];
            if (lastElement.submitStatus === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Haven't submitted Betting Card",

                });
            } else {
                const now = moment();
                const nownow = now.format('YYYY-MM-DD HH:mm:ss');
                const result = await fetchTipTenMinBefore(nownow);
                if (result.length === 0) {
                    // User not found
                    return res.json({
                        success: false,
                        message: "Tips will be displayed 10 min before race time ",
                    });
                } else {
                    const allRaceData = await getAllRaceData(result[0].race_id)
                    if (allRaceData.length === 0) {
                        // User not found
                        return res.json({
                            success: false,
                            message: "No Tips for today",
                        });
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: "Tips got successfully",
                            data: allRaceData,
                        });
                    }

                }
            }
        } else {
            const now = moment();
            const nownow = now.format('YYYY-MM-DD HH:mm:ss');
            const result = await fetchTipTenMinBefore(nownow);
            if (result.length === 0) {
                // User not found
                return res.json({
                    success: false,
                    message: "No Tips ",
                });
            } else {
                const allRaceData = await getAllRaceData(result[0].race_id)
                if (allRaceData.length === 0) {
                    // User not found
                    return res.json({
                        success: false,
                        message: "No Tips for today",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "Tips got successfully",
                        data: allRaceData,
                    });
                }

            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_todays_tips = async(req, res) => {
    try {

        const today = moment();
        const currentTime = today.valueOf();
        const formattedDate = today.format('YYYY-MM-DD');
        const result = await fetchAllTodays_Tips(formattedDate);

        result.forEach(async element => {
            // console.log(element.milisec);
            if (element.milisec - currentTime < 0) {
                const updateStatus = await updateRaceStatus(element.id, 'Completed')
                    // console.log(updateStatus)
            }
        });
        // console.log(result);
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "No Tips for today",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "Tips got successfully",
                data: result,
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
};
exports.backup = async(req, res) => {
    try {
        const status = await getViewStatus();

        // console.log(status[0].race_id);
        const gotRaceId = status[0].race_id;
        if (status.length === 0) {

        } else {
            const check = await checkRaceId(gotRaceId);
            // console.log(gotRaceId);
            // console.log("chech==>", check[0].race_id);

            if (check[0].race_id !== gotRaceId) {


            } else {

            }
        }
        const today = moment();
        const currentTime = today.valueOf();

        // console.log(today.format('YYYY-MM-DD'));

        const formattedDate = today.format('YYYY-MM-DD');
        // console.log("get todays tips current time====", formattedDate);
        const result = await fetchAllTodays_Tips(formattedDate);
        
        result.forEach(async element => {
            // console.log(element.milisec);
            if (element.milisec - currentTime < 0) {
                
                const updateStatus = await updateRaceStatus(element.id, 'Completed')
                    // console.log(updateStatus)
            }
        });
        // console.log(result);
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "No Tips for today",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "Tips got successfully",
                data: result,
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
};
exports.get_raceById = async(req, res) => {
    try {

        const id = req.params.race_id
        const allRaceData = await getAllRaceData(id)
        if (allRaceData.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "No Tips for today",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "Tips got successfully",
                data: allRaceData,
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
};
exports.get_allRacesForUsers = async(req, res) => {
    try {

        const result = await allRaces();
      
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "Unable to get all races",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "All races fetched successfully",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.getPerformanceStats = async(req, res) => {
    try {
       
        const user_id = req.params.user_id;
        
        const result = await fetchPerformanceStats(user_id);
       
        await Promise.all(result.map(async(items)=>{
           
            const response = await fetchPerformanceByDate(user_id, items.bet_date);
            if(response.length >0){
                items.bet_data = response
            }else{
                items.bet_data = [];
            }
        }))
        
        if (result.length === 0) {
            // User not found
            return res.json({
                success: false,
                message: "Unable to get your performance status",
            });
        } else {
            // User found
            return res.status(200).json({
                success: true,
                message: "Performance stats fetched successfully",
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.diary_one = async(req, res) => {
    try {
        const {
            user_id,
            date,
            bettingPlan,
            followedPlan,
            reasonsForDeviation,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            bettingPlan: Joi.string().required(),
            followedPlan: Joi.string().required(),
            reasonsForDeviation: Joi.string().allow(''),
            lessonsLearned: Joi.string().allow(''),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.status(400).json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const diaryEntry = {
                user_id: user_id,
                date: date,
                bettingPlan: bettingPlan,
                followedPlan: followedPlan,
                reasonsForDeviation: reasonsForDeviation,
                lessonsLearned: lessonsLearned,

            };

            const result = await diaryOneInsert(diaryEntry);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "No Tips",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}

exports.updateDiary_one = async(req, res) => {
    try {
        const {
            id,
            date,
            bettingPlan,
            followedPlan,
            reasonsForDeviation,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            bettingPlan: Joi.string().required(),
            followedPlan: Joi.string().required(),
            reasonsForDeviation: Joi.string().allow(''),
            lessonsLearned: Joi.string().allow(''),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {


            const result = await diaryOneUpdate(date, bettingPlan, followedPlan, reasonsForDeviation, lessonsLearned, id);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "No Tips",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.deleteDiaryOne = async(req, res) => {
    try {
        const {
            id
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const response = await diaryOneDelete(id);
            return res.json({
                message: "Diary row deleted successfully!",
                status: 200,
                success: true,
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}

exports.deleteDiaryTwo = async(req, res) => {
    try {
        const {
            id
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const response = await diaryTwoDelete(id);
            return res.json({
                message: "Diary row deleted successfully!",
                status: 200,
                success: true,
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.deleteDiaryThree = async(req, res) => {
    try {
        const {
            id
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const response = await diaryThreeDelete(id);
            return res.json({
                message: "Diary row deleted successfully!",
                status: 200,
                success: true,
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.deleteDiaryFour = async(req, res) => {
    try {
        const {
            id
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const response = await diaryFourDelete(id);
            return res.json({
                message: "Diary row deleted successfully!",
                status: 200,
                success: true,
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.deleteDiaryFive = async(req, res) => {
    try {
        const {
            id
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const response = await diaryFiveDelete(id);
            return res.json({
                message: "Diary row deleted successfully!",
                status: 200,
                success: true,
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}

exports.get_all_users = async(req, res) => {
    try {
        const all_users = await get_all_users();
        if (all_users != 0) {
            return res.json({
                message: "all users ",
                status: 200,
                success: true,
                all_users: all_users,
            });
        } else {
            return res.json({
                message: "No data found ",
                status: 200,
                success: false,
            });
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

exports.delete_user = async(req, res) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("authHeader>>>>>>>", authHeader);
        const token_1 = authHeader;
        const token = token_1.replace("Bearer ", "");

        console.log(">>>>>>>>>>>", token);

        const decoded = jwt.decode(token);
        const user_id = decoded.data.id;

        const Delete_user = await delete_User(user_id);

        

        return res.json({
            message: "User deleted successfully!",
            status: 200,
            success: true,
        });
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


// Define the Joi validation schema


// function convertTimeStringToTimestamp(timeString) {
//     // Split the time string into hours, minutes, and seconds
//     const [hours, minutes, seconds] = timeString.split(':').map(Number);

//     // Create a new Date object with the specified time
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(seconds);

//     // Get the timestamp using getTime()
//     const timestamp = date.getTime();

//     return timestamp;
// }




exports.getStake = async(req, res) => {
    try {
        const {

            odds,
        } = req.body;
        const schema = Joi.alternatives(
            Joi.object({

                odds: Joi.number().required(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
            });
        } else {
            const result = await get_stake(odds);

            if (result.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Stake fetched successfully",
                    data: result,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Stake not found",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.get_race = async(req, res) => {
    try {

        // Convert the race_date string to a Date object

        // console.log();
        // Get today's date
        const today = moment();

        const formattedDate = today.format('YYYY-MM-DD');
        // console.log("formatted====>", formattedDate);
        // Check if the race_date is in the future or today

        const result = await fetchRaceByVenue(formattedDate);

        await Promise.all(result.map(async(item) => {

            // console.log("item====>", item);
            const response = await fetchRaceByDate(formattedDate, item.race_venue, item.city);

            if (response.length > 0) {
                item.race_data = response;
            } else {
                item.race_data = [];
            }

        }));

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Race fetched successfully",
                data: result, // You can customize this part
            });
        } else {
            return res.json({
                success: false,
                message: "There are no races for today",
                status: 400,
                data: "Invalid race date",
            });
        }


    } catch (error) {
        return res.json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error,
        });
    }
}
exports.upcoming_races = async(req, res) => {
    try {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0];
      
        const upcom = await upcoming(currentDateString);
        
        if (upcom.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'upcoming races fetched sucessfully',
                data: upcom,
            });
        } else {
            return res.json({
                success: false,
                message: "No upcoming races",
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error,
        });
    }
}
exports.contact = async(req, res) => {
    try {
        const {
            name,
            email,
            phone_no,
            message,
            subject,
        } = req.body;
        const schema = Joi.object({
            name: [Joi.string().empty().required()],
            email: [
                Joi.string()
                .min(5)
                .max(255)
                .email({ tlds: { allow: false } })
                .lowercase()
                .required(),
            ],
            phone_no: Joi.string()
                .empty()
                .pattern(/^[0-9]{10}$/) // Example: 10-digit phone number
                .required(),
            message: Joi.string().required(),
            subject: Joi.string().required(),

        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const make = {
                name: name,
                email: email,
                phone_no: phone_no,
                message: message,
                subject: subject,
            };
            let mailOptions = {
                from: email,
                to: "tiptwo02@gmail.com",
                subject: "Queries",
                template: "contact",
                context: {

                    // href_url: `${baseurl}/verifyUser/${encodeURIComponent(act_token)}`,
                    image_logo: baseurl + `/image/Header_logo.png`,
                    msg: make,
                    message: 'Your query sent successfully'

                },

            };
            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log(error);
                    return res.json({
                        success: false,
                        status: 400,
                        message: "Mail Not delivered",
                    });
                } else {


                    const result = await registerContact(make);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({
                            success: true,
                            message: 'Contact Info saved and sent successfully on tiptwo02@gmail.com',
                            data: result,
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: "Unable to save contact info ",
                        });
                    }

                }
            });



        }
    } catch (error) {
        return res.json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error,
        });
    }
}
exports.diary_two = async(req, res) => {
    try {
        const {
            user_id,
            date,
            plannedWagerAmount,
            actualWagerAmount,
            comfortLevel,
            reasonsForComfortLevel,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            plannedWagerAmount: Joi.string().required(),
            actualWagerAmount: Joi.string().required(),
            comfortLevel: Joi.string().required(),
            reasonsForComfortLevel: Joi.string().required(),
            lessonsLearned: Joi.string().required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const diaryEntry = {
                user_id: user_id,
                date: date,
                plannedWagerAmount: plannedWagerAmount,
                actualWagerAmount: actualWagerAmount,
                comfortLevel: comfortLevel,
                reasonsForComfortLevel: reasonsForComfortLevel,
                lessonsLearned: lessonsLearned,

            };

            const result = await diaryTwoInsert(diaryEntry);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary 2 entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to save diary 2 ",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.diary_three = async(req, res) => {
    try {
        const {
            user_id,
            date,
            horseBetting,
        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            horseBetting: Joi.string().required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const diaryEntry = {
                user_id: user_id,
                date: date,
                horseBetting: horseBetting,
            };

            const result = await diaryThreeInsert(diaryEntry);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to save",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.updateDiary_Three = async(req, res) => {
    try {
        const {
            id,
            date,
            horseBettings,
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            horseBettings: Joi.string().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const tips = JSON.parse(req.body.data)
            const result = await diaryThreeUpdate(date, horseBettings, id);

            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary 3 entry updated successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to update",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}

exports.diary_four = async(req, res) => {
    try {
        const {
            user_id,
            date,
            emotionalControl,
            triggers,
            actionTaken,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            emotionalControl: Joi.string().required(),
            triggers: Joi.string().required(),
            actionTaken: Joi.string().required(),
            lessonsLearned: Joi.string().required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const diaryEntry = {
                user_id: user_id,
                date: date,
                emotionalControl: emotionalControl,
                triggers: triggers,
                actionTaken: actionTaken,
                lessonsLearned: lessonsLearned
            };

            const result = await diaryFourInsert(diaryEntry);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to save",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.updateDiary_Four = async(req, res) => {
    try {
        const {
            id,
            date,
            emotionalControl,
            triggers,
            actionTaken,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            emotionalControl: Joi.string().required(),
            triggers: Joi.string().required(),
            actionTaken: Joi.string().required(),
            lessonsLearned: Joi.string().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const result = await diaryFourUpdate(date, emotionalControl, triggers, actionTaken, lessonsLearned, id);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary 4 entry Updated successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to update",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.diary_five = async(req, res) => {
    try {
        const {
            user_id,
            date,
            areasOfImprovement,
            potentialSolutions,
            actionsTaken,

        } = req.body;
        const schema = Joi.object({
            user_id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            areasOfImprovement: Joi.string().required(),
            potentialSolutions: Joi.string().required(),
            actionsTaken: Joi.string().required(),

        });
        const result = schema.validate(req.body);
        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {

            const diaryEntry = {
                user_id: user_id,
                date: date,
                areasOfImprovement: areasOfImprovement,
                potentialSolutions: potentialSolutions,
                actionsTaken: actionsTaken,
            };

            const result = await diaryFiveInsert(diaryEntry);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to save",
                });
            }


        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.updateDiary_Five = async(req, res) => {
    try {
        const {
            id,
            date,
            areasOfImprovement,
            potentialSolutions,
            actionsTaken,
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            areasOfImprovement: Joi.string().required(),
            potentialSolutions: Joi.string().required(),
            actionsTaken: Joi.string().required(),

        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const result = await diaryFiveUpdate(date, areasOfImprovement, potentialSolutions, actionsTaken, id);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary 5 entry Updated successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unableto update",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}
exports.updateDiary_Two = async(req, res) => {
    try {
        const {
            id,
            date,
            plannedWagerAmount,
            actualWagerAmount,
            comfortLevel,
            reasonsForComfortLevel,
            lessonsLearned
        } = req.body;
        const schema = Joi.object({
            id: Joi.number().required(),
            date: Joi.string().empty().required().regex(/^\d{4}-\d{2}-\d{2}$/)
                .message('date should be in the format YYYY-MM-DD'),
            plannedWagerAmount: Joi.string().required(),
            actualWagerAmount: Joi.string().required(),
            comfortLevel: Joi.string().required(),
            reasonsForComfortLevel: Joi.string().required(),
            lessonsLearned: Joi.string().required(),
        });
        const result = schema.validate(req.body);

        if (result.error) {
            // Validation failed
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: message,
                error: "Validation error",
                success: false,
            });
        } else {
            const result = await diaryTwoUpdate(date, plannedWagerAmount, actualWagerAmount, comfortLevel, reasonsForComfortLevel, lessonsLearned, id);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Diary 2 entry saved successfully',
                    data: result,
                });
            } else {
                return res.json({
                    success: false,
                    message: "Unable to update",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            status: 500,
            error: error.message,
        });
    }
}


exports.change_Password = async(req, res) => {
    try {
        const { old_password, password, confirm_password, email } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                password: Joi.string().min(8).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                confirm_password: Joi.string().min(8).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 8 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                email: [Joi.string().empty().required()],
                old_password: [Joi.string().empty().required()],
            })
        );
        const result = schema.validate(req.body);
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
            const get_user = await fetchUserByEmail(email);
            var token = get_user[0].token;

        
            if (get_user[0].show_password == old_password) {
                if (password == confirm_password) {
                    const data = await fetchUserByEmail(email);

                    if (data.length !== 0) {
                        const update_show_password = await updatePassword_1(
                            password,
                            token
                        );
                        const hash = await bcrypt.hash(password, saltRounds);
                        const result2 = await updatePassword(hash, token);
                        const data = await fetchUserByEmail(email);
                        return res.json({
                            message: "successfully password change",
                            success: true,
                            status: 200,
                            responce: data[0],
                        });
                    } else {
                        return res.json({
                            message: "User not found please sign-up first",
                            success: false,
                            status: 400,
                        });
                    }
                } else {
                    return res.json({
                        message: "Password and Confirm Password do not match ",
                        success: false,
                        status: 400,
                    });
                }
            } else {
                return res.json({
                    message: "old password does't match. ",
                    success: false,
                    status: 400,
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};