const express = require('express');
const router = express.Router();
const getUsers = require('../controllers/getUsers')
const getUserByName = require('../controllers/getUserByName')
const sortUsers = require('../controllers/sortUsers')
const getUsersByFilter = require('../controllers/getUsersByFilter')



router.get('/', (req , res) => {
	res.json({hola: 'mundo'})
})

router.get('/users', getUsers)
router.get('/user', getUserByName)
router.get('/orderUsers', sortUsers)
router.get('/usersByFilter', getUsersByFilter)



module.exports = router