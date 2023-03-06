const sql = require("./db.js");

const Wallet = {};

Wallet.getAlldata = (user_id, result) => {
  var resultData = {};
  //var storeData={};
  sql.query(
    `SELECT * FROM weapon_master WHERE is_paid=1`,
    (err, weaponData) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      resultData.weaponData = weaponData;
      sql.query(
        `SELECT * FROM character_master WHERE is_paid=1`,
        (err, characterData) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          resultData.characterData = characterData;
          console.log("storeAPI get all : ", resultData);
          result(null, resultData);
        }
      );
    }
  );
};

Wallet.buyStoreItem = (data, result) => {
  if (data.item_type == "Weapon") {
    sql.query(
      `SELECT * FROM users_buy_store_items WHERE user_id='${data.user_id}' AND item_type='Weapon' AND item_id = '${data.item_id}'`,
      (err, buyWeaponData) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (buyWeaponData.length > 0) {
          result({ message: "Item already purchased" }, null);
          return;
        }
        if (buyWeaponData.length == 0) {
          sql.query(
            `SELECT * FROM weapon_master WHERE id='${data.item_id}'`,
            (err, weaponData) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              if (weaponData.length > 0) {
                sql.query(
                  `SELECT * FROM users_info WHERE user_id = '${data.user_id}'`,
                  (err, userInfo) => {
                    if (err) {
                      console.log("error: ", err);
                      result(err, null);
                      return;
                    }
                    if (userInfo[0].diamond > weaponData[0].amount) {
                      var updatedDiamond =
                        userInfo[0].diamond - weaponData[0].amount;
                      sql.query(
                        `UPDATE users_info SET diamond = '${updatedDiamond}' WHERE user_id = '${data.user_id}'`,
                        (err, updateUserInfo) => {
                          if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                          }
                          sql.query(
                            `INSERT INTO user_game_diamond_transactions (user_id, diamond,type, descriptions) VALUES ('${data.user_id}', '${weaponData[0].amount}', 'debit', 'Weapon purchase')`,
                            (err1, res12) => {
                              if (err1) {
                                console.log("error: ", err1);
                                result(err1, null);
                                return;
                              }
                            }
                          );
                          sql.query(
                            `INSERT INTO users_buy_store_items (user_id, item_id,item_type) VALUES ('${data.user_id}', '${data.item_id}', '${data.item_type}')`,
                            (err111, res1211) => {
                              console.log(
                                "Error and response:",
                                err111,
                                res1211
                              );
                              if (err111) {
                                console.log("error: ", err111);
                                result(err111, null);
                                return;
                              }
                              result(null, {
                                message: "Weapon purchased successfully",
                                updatedDiamond: updatedDiamond,
                                status: true,
                              });
                            }
                          );
                        }
                      );
                    } else {
                      result(
                        {
                          message:
                            "You have less no of Diamonds, Please add Diamonds to buy",
                        },
                        null
                      );
                      return;
                    }
                  }
                );
              } else {
                result(
                  {
                    message: "There is no matched item id",
                  },
                  null
                );
                return;
              }
            }
          );
        }
      }
    );
  } else if (data.item_type == "Character") {
    sql.query(
      `SELECT * FROM users_buy_store_items WHERE user_id='${data.user_id}' AND item_type='Character' AND item_id = '${data.item_id}'`,
      (err, buyCharacterData) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (buyCharacterData.length > 0) {
          result({ message: "Item already purchased" }, null);
          return;
        }
        if (buyCharacterData.length == 0) {
          sql.query(
            `SELECT * FROM character_master WHERE id='${data.item_id}'`,
            (err, characterData) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }
              if (characterData.length > 0) {
                sql.query(
                  `SELECT * FROM users_info WHERE user_id = '${data.user_id}'`,
                  (err, userInfo) => {
                    if (err) {
                      console.log("error: ", err);
                      result(err, null);
                      return;
                    }
                    if (userInfo[0].diamond > characterData[0].amount) {
                      var updatedDiamond =
                        userInfo[0].diamond - characterData[0].amount;
                      sql.query(
                        `UPDATE users_info SET diamond = '${updatedDiamond}' WHERE user_id = '${data.user_id}'`,
                        (err, updateUserInfo) => {
                          if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                          }
                          sql.query(
                            `INSERT INTO user_game_diamond_transactions (user_id, diamond,type, descriptions) VALUES ('${data.user_id}', '${characterData[0].amount}', 'debit', 'Character purchase')`,
                            (err1, res12) => {
                              if (err1) {
                                console.log("error: ", err1);
                                result(err1, null);
                                return;
                              }
                            }
                          );
                          sql.query(
                            `INSERT INTO users_buy_store_items (user_id, item_id,item_type) VALUES ('${data.user_id}', '${data.item_id}', '${data.item_type}')`,
                            (err111, res1211) => {
                              if (err111) {
                                console.log("error: ", err111);
                                result(err111, null);
                                return;
                              }
                              result(null, {
                                message: "Character purchased successfully",
                                updatedDiamond: updatedDiamond,
                                status: true,
                              });
                            }
                          );
                        }
                      );
                    } else {
                      result(
                        {
                          message:
                            "You have less no of Diamonds, Please add Diamonds to buy",
                        },
                        null
                      );
                      return;
                    }
                  }
                );
              } else {
                result(
                  {
                    message: "There is no matched item id",
                  },
                  null
                );
                return;
              }
            }
          );
        }
      }
    );
  } else {
    result({ mesaage: "Item type is not valid" }, null);
    return;
  }
};

module.exports = Wallet;
