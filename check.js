exports.signup = (async(req, res) => {
    try {
        var CurrentDate = moment().format();
        const { email, firstname, lastname, password, phone } = req.body;
        const actToken = betweenRandomNumber(10000000, 99999999);
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({ tlds: { allow: false } })
                    .lowercase()
                    .required().messages({
                        "any.required": "Email is required!!",
                        "string.empty": "can't be empty!!",
                        "string.min": "minimum 5 value required",
                        "string.max": "maximum 255 values allowed",
                    }),
                password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "Password is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                firstname: Joi.string().empty().required().messages({
                    "string.empty": " firstname can't be empty",
                    "string.required": "firstname is required",
                }),
                lastname: Joi.string().empty().required().messages({
                    "string.empty": "lastname can't be empty",
                    "string.required": "lastname is required",
                }),
                phone: [Joi.number().empty().required()]

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
            let success1 = "";
            let message1 = "";
            let results = [];
            const result1 = await fetchUserByEmail(email);


            if (result1.length === 0) {
                bcrypt.genSalt(saltRounds, async function(err, salt) {
                    bcrypt.hash(password, salt, async function(err, hash) {
                        if (err) throw err;

                        let user = {
                            email: email,
                            password: hash,
                            firstname: firstname,
                            lastname: lastname,
                            phone: phone,
                            act_token: actToken,
                            created_at: CurrentDate
                        }

                        const result = await addUser(user);

                        if (result.affectedRows > 0) {

                            let mailOptions = {
                                from: 'glistener.dev@gmail.com',
                                to: email,
                                subject: 'Activate Account',
                                template: 'signupemail', // the name of the template file i.e email.handlebars
                                context: {


                                    href_url: `http://44.197.223.72:4000/verifyhomeUser/${actToken}/${result.insertId}`,
                                    image_logo: `http://44.197.223.72:4000/image/logo.png`,
                                    msg: `Your account has been created successfully and is ready to use.`
                                }
                            };

                            transporter.sendMail(mailOptions, async function(error, info) {

                                console.log(error)
                                if (error) {

                                    return res.json({
                                        success: true,
                                        message: 'Mail Not delivered',
                                        status: 200,
                                        userInfo: {}
                                    })
                                } else {


                                    if (result.insertId > 0) {
                                        results = await fetchUserById(result.insertId);
                                    }
                                    return res.json({
                                        success: true,
                                        message: 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
                                        userinfo: results[0],
                                        status: 200
                                    });
                                }
                            })


                        } else {
                            return res.json({
                                message: "User failed to register",
                                status: 400,
                                success: false,
                                userinfo: {},
                            })
                        }
                    });
                });

            } else {
                return res.json({
                    success: false,
                    message: "Already Exists",
                    status: 400,
                    userInfo: {}
                });
            }

        }
    } catch (error) {
        console.log(error, "<==error")
        return res.json({
            message: "Internal server error",
            status: 500,
            success: false
        })
    }
});

exports.verifyUser = (async(req, res) => {
    try {
        const { token } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                token: [Joi.number().empty(), Joi.string().empty()],
            })
        );

        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true
            });
        } else {
            const result = await fetchUserToken(token);
            if (result.length != 0) {
                let data = {
                    act_token: ''
                };
                const token = jwt.sign({
                        data: {
                            id: result[0].id,
                        },
                    },
                    'SecretKey');

                const resultUpdate = await updateVerifyUser(data, result[0].id);
                if (resultUpdate.affectedRows) {
                    return res.json({
                        message: "verify user successfully",
                        userinfo: result[0],
                        token: token,
                        status: 200,
                        success: true
                    })
                } else {
                    return res.json({
                        message: "update user failed ",
                        status: 200,
                        success: true,
                        userinfo: {},
                        token: "",
                    })
                }

            } else {
                return res.json({
                    message: 'Token not found',
                    status: 200,
                    success: true,
                    userinfo: {},
                    token: "",
                })
            }
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500
        })
    }
});