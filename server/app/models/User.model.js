const sql = require("./db.js");
const bcrypt = require("bcrypt");

const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;

const nodemailer = require("nodemailer");
const emailConfig = require("../config/email.config.js");

var myAddress = "0x9B4D15c43b7Ba746d5907EFe87705e3e6f9dC82C";
var privateKey =
  "3e1ffd1ce751cc662e20583f00ed99ee7ff9463931e405e8dc8657aa75fc41f9";
//var toAddress = '0x8546c0aFfD56d126579b28A0CDa38584ab6876A4';
//contract abi is the array that you can get from the ethereum wallet or etherscan
var abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "GameToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TEAM_MANAGER", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rescueFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "rescueToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_status", "type": "bool" }], "name": "setPauser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }], "name": "setToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];
var contractAddress = "0x657A0ACD2dB1b0Ede741E9Ac55816699dB68FDEe";
//Infura HttpProvider Endpoint
const rpcURL = "https://polygon-rpc.com"; // Your RPC URL goes here
const web3 = new Web3(rpcURL);
const contract = new web3.eth.Contract(abi, contractAddress);

const User = function (user) {
  this.user_name = user.user_name;
  this.email = user.email;
  this.password = user.password;
  this.otp = user.otp;
  this.dob = user.dob;
};

User.create = (newUser, result) => {
  sql.query(
    `SELECT * FROM users WHERE email = '${newUser.email}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log("Email already exists: ", res[0]);
        result({ message: "Email already exists" }, null);
      }
      //console.log("res email",res[0]);
      if (res.length != 1) {
        sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("created User: ", { user_id: res.insertId, ...newUser });

          //result(null, { user_id: res.insertId, ...newUser });
          sql.query(`SELECT * FROM game_defaults_items`, (err11, res14) => {
            if (err11) {
              console.log("error: ", err11);
              result(err11, null);
              return;
            }
            console.log(res14[0]);
            sql.query(
              `INSERT INTO users_info (user_id, diamond, coin, language,character_id,game_map_id) VALUES ('${res.insertId}', '${res14[0].diamond}', '${res14[0].coin}', '${res14[0].language}','${res14[0].character_id}','${res14[0].game_map_id}')`,
              (err1, res12) => {
                if (err1) {
                  console.log("error: ", err1);
                  result(err1, null);
                  return;
                }
              }
            );
          });
          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '1', 'Primary', '9','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '1', 'Secondary', '10','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '1', 'Letal', '11','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '1', 'Perks', '12','Weapon','Pistol')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '2', 'Primary', '9','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '2', 'Secondary', '10','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '2', 'Letal', '11','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '2', 'Perks', '12','Weapon','Pistol')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '3', 'Primary', '9','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '3', 'Secondary', '10','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '3', 'Letal', '11','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '3', 'Perks', '12','Weapon','Pistol')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '4', 'Primary', '9','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '4', 'Secondary', '10','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '4', 'Letal', '11','Weapon','Machinegun')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          sql.query(
            `INSERT INTO users_loadout (user_id, loadout_no, loadout_location, item_id,item_type,type) VALUES ('${res.insertId}', '4', 'Perks', '12','Weapon','Pistol')`,
            (err1, res1) => {
              if (err1) {
                console.log("error: ", err1);
                result(err1, null);
                return;
              }
            }
          );

          result(null, { user_id: res.insertId, ...newUser });
        });
      }
    }
  );
};
User.logIn = (data, result) => {
  sql.query(
    `SELECT * FROM users u LEFT JOIN users_info ui ON ui.user_id=u.user_id WHERE email = '${data.body.email}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        bcrypt.compare(
          data.body.password,
          res[0].password,
          function (err, userres) {
            if (userres) {
              console.log("found user: ", res[0]);
              result(null, res[0]);
              console.log("It matches!");
            } else {
              result({ message: "Invalid Password" }, null);
              console.log("Invalid password!");
            }
          }
        );

        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

//updateSelectedCharacter

User.updateSelectedCharacter = (data, result) => {
  sql.query(
    `UPDATE users_info SET character_id ='${data.item_id}' WHERE user_id='${data.user_id}'`,
    (err, updateCharacter) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, {
        message: "Character ID updated successfully",
        character_id: data.item_id,
      });
    }
  );
};

//updateDiamond
User.updateUserDiamond = (data, result) => {
  sql.query(
    `SELECT * FROM users_info  WHERE user_id='${data.user_id}'`,
    (err, getDiamond) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("getDiamond:", getDiamond);
      if (getDiamond.length > 0) {
        diamondUpdateInt =
          parseInt(getDiamond[0].diamond) + parseInt(data.diamond);
        const diamondUpdateStr = diamondUpdateInt.toString();

        sql.query(
          `UPDATE users_info SET diamond ='${diamondUpdateStr}' WHERE user_id='${data.user_id}'`,
          (err, updateInfo) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            sql.query(
              `INSERT into user_game_diamond_transactions (user_id,diamond,type,descriptions) value('${data.user_id}','${data.diamond}',"credit","Dimond Credited")`,
              (err, updateInfo) => {
                if (err) {
                  console.log("error: ", err);
                  result(err, null);
                  return;
                }
              }
            );

            result(null, {
              message: "Diamond updated successfully",
              diamond: diamondUpdateStr,
            });
          }
        );
      } else {
        result({ message: "User not found" }, null);
      }
    }
  );
};

User.withdrawTokenBLD = (data, result) => {
  sql.query(
    `SELECT * FROM users_info  WHERE user_id='${data.user_id}'`,
    (err, getDiamond) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (getDiamond.length > 0 && getDiamond[0].diamond > data.token_amount) {
        diamondUpdate = getDiamond[0].diamond - data.token_amount;


        const amount = data.token_amount;
        const toAddress = data.metamask_address;
        var rawTransaction = {
          from: myAddress,
          gasPrice: web3.utils.toHex(2000 * 1e9),
          gasLimit: web3.utils.toHex(84000),
          to: contractAddress,
          value: "0x0",
          data: contract.methods
            .withdraw(toAddress, web3.utils.toWei(amount.toString()))
            .encodeABI(),
        };

        web3.eth.accounts
          .signTransaction(rawTransaction, privateKey)
          .then(function (value) {
            web3.eth
              .sendSignedTransaction(value.rawTransaction)
              .then(function (response) {
                console.log(
                  "response:" + JSON.stringify(response, null, " ")
                );
                if (response.status) {
                  sql.query(
                    `UPDATE users_info SET diamond ='${diamondUpdate}' WHERE user_id='${data.user_id}'`,
                    (err, updateInfo) => {
                      if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                      }
                      sql.query(
                        `INSERT INTO bld_transaction (user_id, transaction_hash, amount) VALUES ('${data.user_id}','${response.transactionHash}','${data.token_amount}')`,
                        (err1, res1) => {
                          if (err1) {
                            console.log("error: ", err1);
                            result(err1, null);
                            return;
                          }

                          sql.query(
                            `INSERT INTO user_game_diamond_transactions (user_id, diamond,type, descriptions) VALUES ('${data.user_id}', '${data.token_amount}', 'withdraw', 'BLD withdraw')`,
                            (err12, res12) => {
                              if (err12) {
                                console.log("error: ", err12);
                                result(err1, null);
                                return;
                              }
                            }
                          );

                          result(null, {
                            message: "Diamond withdraw successfully",
                            diamond: diamondUpdate,
                          });
                        }
                      );
                    }
                  );
                } else {
                  result({ message: "Something happen, Error Occured" }, null);
                }
              });
          });

      } else {
        result({ message: "Amount is low" }, null);
      }
    }
  );
};

// Forget Password

User.forgetPasswordUser = (data, result) => {
  sql.query(
    `SELECT * FROM users  WHERE email='${data.user_email}'`,
    (err, getUser) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (getUser && getUser.length > 0) {
        var otp = Math.floor(1000 + Math.random() * 9000);

        sql.query(
          `UPDATE users SET otp ='${otp}' WHERE email='${data.user_email}'`,
          (err, updatePlayer) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            // send email

            var transporter = nodemailer.createTransport({
              service: emailConfig.SERVICE,
              auth: emailConfig.AUTH,
            });
            var details = {
              from: emailConfig.AUTH.user, // sender address same as above
              to: `${data.user_email}`, // Receiver's email id
              subject: "Your OTP for reset your password ", // Subject of the mail.
              html:
                "<h3>OTP for account verification is </h3>" +
                "<h1 style='font-weight:bold;'>" +
                otp +
                "</h1>", // Sending OTP
            };

            transporter.sendMail(details, function (error, data) {
              if (error) console.log(error);
              else console.log("CheckData:", data);
            });

            result(null, {
              message:
                "OTP has been sent to your register email id please check!",
            });
          }
        );
      } else {
        result({ message: "Email id does not exist" }, null);
      }
    }
  );
};

// Verify Password

User.verifyPasswordUser = async (user, result) => {
  sql.query(
    `SELECT * FROM users  WHERE email='${user.email}'`,
    async (err, getUser) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (getUser.length > 0) {
        var validPassword = await bcrypt.compare(
          user.password,
          getUser[0].password
        );
      }

      if (getUser && getUser.length > 0 && validPassword === false) {
        sql.query(
          `SELECT * FROM users  WHERE email='${user.email}' AND otp='${user.otp}'`,
          async (err, updateUser) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            const saltRounds = 10;
            const password = user.password;
            const encryptedPassword = await bcrypt.hash(password, saltRounds);

            if (updateUser.length > 0) {
              const userEmail = updateUser[0].email;
              sql.query(
                `UPDATE users SET password ='${encryptedPassword}' WHERE email='${userEmail}'`,
                (err, updatePlayer) => {
                  if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                  }
                  result(null, {
                    message: "Password has been reset successfully",
                  });
                }
              );
            } else {
              result({ message: "OTP is invalid please check!" }, null);
            }
          }
        );
      } else if (validPassword === true) {
        result(
          { message: "Password must be different from previous one!" },
          null
        );
        getUser.length;
      } else if (getUser.length === 0) {
        result({ message: "Email id is invalid please check!" }, null);
      } else {
        result({ message: "OTP is invalid please check!" }, null);
      }
    }
  );
};

module.exports = User;
