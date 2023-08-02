
const getUsers = async (req, res) => {
  try {

    const {start, end} = req.query

    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();

    // Obtener solo los datos de los primeros 10 usuarios
    const usersData = data.users.slice(start, end);

    res.json(usersData);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
  }
};

module.exports = getUsers