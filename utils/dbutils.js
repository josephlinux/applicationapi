const mysql = require('mysql2');
const email_service = require('./emailservices');
exports.execQuery = function (ConPool, Qry, cntxtDtls, values, callback) {

    if (callback && typeof callback == "function") {
          ConPool.getConnection(function (err, connection) {    // get connection from Connection Pool 
                if (err) {
                      console.log("err:  ",err)
                      //  logger.error('error while getting connection from connection pool', err);
                      callback(err, null);
                      return err;
                }
                // mysql.format(Qry);
                // Execute the query
                connection.query(Qry, values, function (err, rows) {
                       logger.info(mysql.format(Qry, values));

                      connection.release();                  // Release connection back to Pool  
                      if (err) { 
                      
                      //  console.warn(`ERror in DB ${cntxtDtls} Query: ${mysql.format(Qry, values)},err :${err}`)
                        callback(err, null); return; } // Handle Query Errors          
                      callback(false, rows);                 // Send the results back  
                      return;
                });
          });
    } else {
          return new Promise(function (resolve, reject) {
                ConPool.getConnection(function (err, connection) {    // get connection from Connection Pool 
                      if (err) {
                            // log.db.conError(cntxtDtls,Qry,err.code,err.fatal); 
                            reject({ "err_status": 500, "err_message": "internel server" });
                      } else {   // Execute the query

                            connection.query(Qry, function (err, rows) {
                                  connection.release();                  // Release connection back to Pool  
                                  if (err) {
                                        // log.db.qryError(cntxtDtls,Qry,err.code,err.fatal); 
                                        reject({ "err_status": 500, "err_message": "internal server" });
                                  } // Handle Query Errors 
                                  else {
                                        resolve(rows);                 // Send the results back  
                                  }
                            }); // End of Qry Execuiton
                      }

                }); // End of get Connection

          }); // End of Promise
    } // End of Else

};


exports.execTranscation = function (ConPool,Qry1,Qry2,Qry3,cntxtDtls,values1,values2,values3,callback) {
      if(callback && typeof callback == "function") {
            ConPool.getConnection(function(err,connection) {    // get connection from Connection Pool 
                  if (err) { connection.rollback(function() { return err; });}
                   
                  /* Begin transaction */
                  connection.beginTransaction(function(err) {
                        if (err) { return err; }
                        
                              
                        connection.query(Qry1,values1,function(err,result) {
                              if (err) { connection.rollback(function() { return err; });}               
                              const insert_id = result.insertId;  

                              // for(var i = 0; i <= QueryCount;i++)
                              // {
                             //console.log(insert_id);
                              values2.splice(0,0,insert_id);
                              var values2f = values2.join().split(','); //console.log(values2f);                              
                              //console.log(values2f);                                    
                              connection.query(Qry2,[[values2f]],function(err, result){
                              if (err) { connection.rollback(function() { return err; });} 
                                    
                                    values3.splice(0,0,insert_id);
                                    var values3f = values3.join().split(','); //console.log(values2f);                              
                                    console.log(values3f);
                              
                                    connection.query(Qry3,[[values3f]],function(err, result){
                                    if (err) { connection.rollback(function() { return err; });}
                                
                                          connection.commit(function(err) {
                                          if (err) { connection.rollback(function() { return err; });}
                                          console.log('Transaction Completed Successfully.');
                                          });
                                          
                                    });
                              });
                              //}

                              connection.release();
                        });
                        
                  });
                  /* End transaction */
            });
      }else{
            return new Promise(function (resolve, reject) {
                  ConPool.getConnection(function (err, connection) {    // get connection from Connection Pool 
                        if (err) {
                              // log.db.conError(cntxtDtls,Qry,err.code,err.fatal); 
                              reject({ "err_status": 500, "err_message": "internel server" });
                        } else {   // Execute the query

                              connection.query(Qry, function (err, rows) {
                                    connection.release();                  // Release connection back to Pool  
                                    if (err) {
                                          // log.db.qryError(cntxtDtls,Qry,err.code,err.fatal); 
                                          reject({ "err_status": 500, "err_message": "internal server" });
                                    } // Handle Query Errors 
                                    else {
                                          resolve(rows);                 // Send the results back  
                                    }
                              }); // End of Qry Execuiton
                        }

                  }); // End of get Connection

            }); // End of Promise
      } // End of Else
};



