

exports.test1 = function (callback) {

    let cntxtDtls = "test1 ";
    let QRY_TO_EXEC = `SELECT * FROM user_data_t`;
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, [], function (err, results) {
        callback(err, results)
        return;
    });
};