const axios = require('axios')

const getUserByName = async (req, res) => {
	const {name, start, end} = req.query

	try{
		const response = await axios.get('https://dummyjson.com/users')
		const user = response.data.users.slice(0,10).filter(elem => elem.firstName.toLowerCase().includes(name.toLowerCase()))
		if(user){
			res.json(user.slice(start, end))
		}	else{
			res.status(404).send('Usuario no encontrado')
		}
	}catch(error){
		res.status(500).send(error.message)
	}
}

module.exports = getUserByName