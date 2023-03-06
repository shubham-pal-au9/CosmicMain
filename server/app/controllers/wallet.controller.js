const User = require("../models/Wallet.model.js");

exports.getAlldata = async (req, res) => {
    // Validate request
    if (!req.body.user_id) {
        res.status(400).send({
            message: "User id can not be empty!"
        });
        return;
    }

    User.getAlldata(req.body.user_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error occured",
                error: err
            });
        }
        else {
            res.send(data);
        }
    });
};


exports.updateUserLoadout = async (req, res) => {

    // Validate request
    if (!req.body.user_id) {
        res.status(400).send({
            message: "User id can not be empty!"
        });
        return;
    }

    if (!req.body.loadout_no) {
        res.status(400).send({
            message: "loadout no  can not be empty!"
        });
        return;
    }
    if (!req.body.loadout_location) {
        res.status(400).send({
            message: "loadout location can not be empty!"
        });
        return;
    }
    if (!req.body.item_id) {
        res.status(400).send({
            message: "item id can not be empty!"
        });
        return;
    }
    if (!req.body.item_type) {
        res.status(400).send({
            message: "item type can not be empty!"
        });
        return;
    }
    if (!req.body.type) {
        res.status(400).send({
            message: "type can not be empty!"
        });
        return;
    }
    User.updateUserLoadout(req.body, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error occured",
                error: err
            });
        }
        else {
            res.send(data);
        }
    });
};