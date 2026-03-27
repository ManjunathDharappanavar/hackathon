const express = require('express');
const router = express.Router();
const {registeruser, login, getuserbyemail, updateuser, deleteuser} = require('../controller/usercontroller');

// endpoints
router.post('/register', registeruser)
router.post('/login', login)
router.get('/getuserbyemail/:email',getuserbyemail)
router.put('/updateuser/:id',updateuser)
router.delete('/deleteuser/:id',deleteuser)

// all endpoints are working
module.exports=router;