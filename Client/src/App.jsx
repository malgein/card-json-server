import { useState, useEffect } from 'react'
import {MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink} from 'mdb-react-ui-kit'
import axios from 'axios'
import './App.css'

function App() {
  
	//Estdo que contiene el valor principal
  const [data, setData] = useState([])
	//estado que contiene el valor de los inputs
	const [value, setValue] = useState('')
	//estado que contiene el valor de los ordenes
	const [sortValue, setSortValue] = useState('')
	//Estado que representa la pagina actual de pagination
	const [currentPage, setCurrentPage] = useState(0)
	//
	const [pageLimit] = useState(4)
	//
	const [sortFilterValue, setSortFilterValue] = useState('')
	//
	const [operation, setOperation] = useState('')

	//opciones de los ordenes 
	const sortOptions = ['firstName', 'address', 'email', 'phone']

  useEffect(() => {
    loadUserData(0, 4, 0)
    console.log(currentPage)
  }, [])

	//*quizas la funcion mas importante con la que se relacionan las demas y la que trae por defecto la data de los usuarios desde el backend y los separa en numeros especificos para mostrarlo en el pagination

	//*muy importante los argumentos de opType y filterOrSortValue pues estos permiten en conjuncion con otras partes del codigo combinar los filtros y los ordenamientos con el pagination

  const loadUserData = async (start, end, increase, opType=null, filterOrSortValue) => {

		switch(opType){
			case 'search':
				setOperation(opType)
				setSortValue('')
				return await axios.get(`http://localhost:3001/user?name=${value}&start=${start}&end=${end}`).then((response) => {
				setData(response.data) 
				setCurrentPage(currentPage + increase)
				setValue('')
				})
				.catch((err) => console.log(err))
			case 'sort':
				setOperation(opType)
				setSortFilterValue(filterOrSortValue)
				return await axios.get(`http://localhost:3001/orderUsers?sortBy=${filterOrSortValue}&start=${start}&end=${end}`)
		.then((response) => {
			setData(response.data)
			setCurrentPage(currentPage + increase)
		})
		.catch((err) => console.log(err))
			case 'filter':
				setOperation(opType)
				setSortFilterValue(filterOrSortValue)
				return await axios.get(`http://localhost:3001/usersByFilter?gender=${filterOrSortValue}&start=${start}&end=${end}`)
		.then((response) => {
			setData(response.data)
			setCurrentPage(currentPage + increase)
		})
		.catch((err) => console.log(err))
			default:
				return await axios.get(`http://localhost:3001/users?start=${start}&end=${end}`)
				.then((response) => {
					setData(response.data)
					//se aumenta la pagina actual y se le suma el incremento
					setCurrentPage(currentPage + increase)
				})
				.catch((err) => console.log(err)) 
		} 
  }
	//funcion que se dispara al hacer un click y  generar un estado de busqueda por nombre
	const handleSearch = async(e) => {
		e.preventDefault()

		loadUserData(0, 4, 0, 'search')
		// return await axios.get(`http://localhost:3001/user?name=${value}`).then((response) => {
		// 	setData(response.data) 
		// 	setValue('')
		// })
		// .catch((err) => console.log(err))
	}

	//funcio que se dispara al clickear alguna opcion de ordenamiento en los filtros de ordenamiento
	const handleSort = async(e) => {
		let value = e.target.value
		setSortValue(value)
		loadUserData(0, 4, 0, 'sort', value)
		// return await axios.get(`http://localhost:3001/orderUsers?sortBy=${value}`)
		// .then((response) => {
		// 	setData(response.data)
		// })
		// .catch((err) => console.log(err))
	}

	//Funcion que se dispara cuando se ejecuta alguna opciion de filtro por genero igual hace un llamado al mismo endpoint de handleSort

	const handleFilter = async(value) => {
		loadUserData(0, 4, 0, 'filter', value)
		// return await axios 
		// .get(`http://localhost:3001/usersByFilter?gender=${value}`)
		// .then((response) => setData(response.data))
		// .catch((err) => console.log(err.message))
	} 

	//funcion que limpia todos los filtros y resultados d busqueda
	const handleReset = () => {
		//las dos siguientes lineas de codigo son muy importantes pues permiten que el boton reset de la app resetee los resultados
		setOperation('')
		setValue('')
		setSortFilterValue('')
		setSortValue('')
		loadUserData(0,4,0)
	}

	//funcion que rendrizara los botones de next y previus page y que controlaran el pagination de los usuarios mostrados el caso default sera de 4 en 4
	const renderPagination = () => {
		//importante linea de codigo que hace que al haber menos de un resultado en el pagination esconde los botenes de next y prev
		if(data.length < 4 && currentPage === 0) return null
		if(currentPage === 0){
			return(
				<MDBPagination className='mb-0'>
					<MDBPaginationItem>
						<MDBPaginationLink>1</MDBPaginationLink>
					</MDBPaginationItem>
					<MDBPaginationItem>
						<MDBBtn onClick={() => loadUserData(4, 8, 1, operation, sortFilterValue)}>Next</MDBBtn>
					</MDBPaginationItem>
				</MDBPagination>
			)
		}	else if(currentPage < pageLimit - 1 && data.length === pageLimit) {
			return(
				<MDBPagination className='mb-0'>
					<MDBPaginationItem>
						<MDBBtn onClick={() => loadUserData((currentPage -1 ) * 4, currentPage * 4, -1, operation, sortFilterValue)}>Prev</MDBBtn>
						<MDBPaginationItem></MDBPaginationItem>
						<MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
					</MDBPaginationItem>
					<MDBPaginationItem>
						<MDBBtn onClick={() => loadUserData((currentPage + 1) * 4, (currentPage + 2) * 4, 1, operation, sortFilterValue)}>Next</MDBBtn>
					</MDBPaginationItem>
				</MDBPagination>
			)
		}	else {
			return(
				<MDBPagination className='mb-0'>
					<MDBPaginationItem>
						<MDBBtn onClick={() => loadUserData((currentPage -1) * 4, currentPage * 4, -1, operation, sortFilterValue)}>Prev</MDBBtn>
					</MDBPaginationItem>
					<MDBPaginationItem>
						<MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
					</MDBPaginationItem>
				</MDBPagination>
			)
		}
	}

  return (
    <div>
      <MDBContainer>
				<form style={{
					margin: "auto",
					padding: "15px",
					maxWidth: "400px",
					alignContent: "center"
				}}
				className="d-flex input-group w-auto"
				onSubmit={handleSearch}
				>
					<input 
						type='text'
						className='form-control'
						placeholder="Search Name ..."
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
						<MDBBtn type='submit' color='dark'>
							Search
						</MDBBtn>
						<MDBBtn className='mx-2' color="info" onClick={() => handleReset()}>
							Reset
						</MDBBtn>
				</form>
        <div style={{marginTop: "100px"}}>
					<h2>Search, filter, Sort, and pagination</h2>
          <MDBRow>
            <MDBCol size="12">
							<MDBTable>
								<MDBTableHead dark>
									<tr>
										<th scope="col">No.</th>
										<th scope="col">Name.</th>
										<th scope="col">Email.</th>
										<th scope="col">Phone.</th>
										<th scope="col">Addres.</th>
										<th scope="col">Gender.</th>
									</tr>
								</MDBTableHead>
								{data.length === 0 ? (
									<MDBTableBody className="align-center mb-0">
										<tr>
											<td colSpan={8} className='text-center'>
												No data found
											</td>
										</tr>
									</MDBTableBody>
								) : (
									data.map((item, index) => (
										<MDBTableBody key={index}>
											<tr>
												<th scope="row">{index + 1}</th>
												<td>{item.firstName}</td>
												<td>{item.email}</td>
												<td>{item.phone}</td>
												<td>{item.address.address}</td>
												<td>{item.gender}</td>
											</tr>
										</MDBTableBody>
									))
								)}
							</MDBTable>
						</MDBCol>
          </MDBRow>
					<div
					style={{
						margin: "auto",
						padding: "15px",
						maxWidth: "250px",
						alignContent: "center"
					}}
					>
						{renderPagination()}
					</div>
        </div>
				{/* la siguiente linea de codigo evita que los filtros y los ordenes puedan verse si no se consigue ninguna data al usar el buscador */}
				{data.length > 0 && (
					<MDBRow>
					<h5>Sort by:</h5>
					<select style={{width: '50%', borderRadius: '2px', height: '35px'}}
					onChange={handleSort}
					value={sortValue}
					>
						<option>Please select value</option>
						{sortOptions.map((item, index) => (
							<option value={item} key={index}>
								{item}
							</option>
						))}
					</select>
					<MDBCol size='8'>

					</MDBCol>
					<MDBCol size='4'>
						<h5>Filter by status</h5>
						<MDBBtnGroup>
							<MDBBtn color="success" onClick={() => handleFilter('female')}>
								Female
							</MDBBtn>
							<MDBBtn color="danger" style={{marginLeft : "2px"}} onClick={() => handleFilter('male')}>
								Male
							</MDBBtn>
						</MDBBtnGroup>
					</MDBCol>
				</MDBRow>
				)}
				
      </MDBContainer>
    </div>
  )
}

export default App
