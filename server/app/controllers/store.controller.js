const Store = require("../models/Store.model.js");

exports.getAlldata = async (req, res) => {
    // Validate request
    if (!req.body.user_id) {
        res.status(400).send({
            message: "User id can not be empty!"
        });
        return;
    }

    Store.getAlldata(req.body.user_id, (err, data) => {
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


exports.buyStoreItem = async (req, res) => {

    // Validate request
    if (!req.body.user_id) {
        res.status(400).send({
            message: "User id can not be empty!"
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

    Store.buyStoreItem(req.body, (err, data) => {
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