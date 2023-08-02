const axios = require('axios')

const getUsersByFilter = async(req, res) => {
	try {
    const { gender, start, end } = req.query;

    // Validamos que el parámetro gender esté presente y sea válido (female o male)
    if (!gender || (gender !== 'female' && gender !== 'male')) {
      return res.status(400).json({ error: 'Invalid gender parameter. It should be "female" or "male".' });
    }

    // Llamada a la API externa dummyjson.com/users
    const response = await axios.get('https://dummyjson.com/users');

    // Filtramos el array de usuarios según el valor de gender
    const filteredUsers = response.data.users.slice(0, 10).filter(user => user.gender === gender);

    // Devolvemos el resultado filtrado
    res.json(filteredUsers.slice(start, end));
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }  
}

module.exports = getUsersByFilter