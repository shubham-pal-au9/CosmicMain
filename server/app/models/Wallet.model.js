const sql = require("./db.js");

const Wallet = {};

Wallet.getAlldata = (user_id, result) => {
  var resultData = {};
  var walletData = {};
  sql.query(`SELECT * FROM weapon_master WHERE is_paid=0`, (err, weaponData) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    walletData.weaponData=weaponData;
    sql.query(`SELECT w.* FROM weapon_master AS w JOIN users_buy_store_items AS s ON w.id=s.item_id WHERE s.item_type='Weapon' AND s.user_id = '${user_id}'`, (err, buyWeaponData) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      
      for ( var index=0; index<buyWeaponData.length; index++ ) {
        walletData.weaponData.push( buyWeaponData[index] );
      }
    });

    sql.query(`SELECT * FROM character_master WHERE is_paid=0`, (err, characterData) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      walletData.characterData =characterData;
      sql.query(`SELECT c.* FROM character_master AS c JOIN users_buy_store_items AS s ON c.id=s.item_id WHERE s.item_type='Character' AND s.user_id = '${user_id}'`, (err, buyCharacterData) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
      
      for ( var index=0; index<buyCharacterData.length; index++ ) {
        walletData.characterData.push( buyCharacterData[index] );
      }
        resultData.walletData = walletData;
      });
      sql.query(`SELECT * FROM users_loadout WHERE user_id = '${user_id}'`, (err, loadoutData) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        resultData.loadoutData = loadoutData;
        console.log("walletAPI: ", resultData);
        result(null, resultData);
      });
    });

  });
};

Wallet.updateUserLoadout = (data, result) => {
  var resultData = {};
  sql.query(`UPDATE users_loadout SET item_id = '${data.item_id}', item_type = '${data.item_type}' , type = '${data.type}' WHERE user_id = '${data.user_id}' AND loadout_no = '${data.loadout_no}' AND loadout_location = '${data.loadout_location}'`, (err, loadoutData) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { "message": "Loadout updated successfully", "loadoutData": data });

  });
};


module.exports = Wallet;