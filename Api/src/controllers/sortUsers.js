
const sortUsers = async(req, res) => {
	try {
    // const { firstName, address, email, phone, gender } = req.body;
    const {sortBy, start, end} = req.query 

    if (!sortBy) {
      return res.status(400).json({ error: 'Debe proporcionar un criterio de ordenamiento válido en el body.' });
    }

    const usersData = await fetch('https://dummyjson.com/users')
      .then((response) => response.json())
      .catch((error) => {
        throw new Error('No se pudo obtener la data de la URL.');
      });

    const sortedData = usersData.users.slice(0, 10).sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      } else if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });

    res.json(sortedData.slice(start, end));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = sortUsers