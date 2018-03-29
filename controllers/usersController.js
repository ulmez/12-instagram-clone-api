const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwtBlacklist.verify(token, process.env.JWT_KEY);
        
        res.status(200).json(decoded);
    } catch(err) {
        res.status(401).json({
            message: 'Authorization failed'
        });
    }
};

module.exports.get_specific_user = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
    .select('_id name email')
    .exec()
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

module.exports.register_new_user = (req, res) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then((user) => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Mail exists already'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    
                    user.save()
                    .then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
};

module.exports.login_user = (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then((users) => {
        if(users.length < 1) {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }
            
            if(result) {
                const token = jwtBlacklist.sign({
                    email: users[0].email,
                    userId: users[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                
                return res.status(200).json({
                    message: 'Authorization successful',
                    token: token
                });
            }

            res.status(401).json({
                message: 'Authorization failed'
            });
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

module.exports.logout_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        jwtBlacklist.blacklist(token);
        
        res.status(200).json({
            message: 'Token blacklisted'
        });
    } catch(err) {
        res.status(401).json({
            message: 'Authorization failed'
        });
    }
};