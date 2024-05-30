const message = {
    "success": { "code": 200, "message": "Transaction successful!" },
    "userExits":{"code":402},
    "AlreadyAssigned":{"code":404},
    "serverError": { "code": 500, "message": "Internal server error. Please try again." },
   "sessionInvalid": { "code": 405, "message": "Session information invalid." },
    "sessionExpired": { "code": 406, "message": "Session expired. Please re-login to continue." },
    "checkUsernamePassword": { "code": 403, "message": "Username or Password incorrect. Please re-enter to try again." },
    "duplicates": { "code": 201, "message": "Duplicate Entries" },
}
exports.message = message;