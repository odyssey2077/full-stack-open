import { useState, useEffect } from 'react'
import personsService from './services/persons'
import axios from 'axios'

const Button = (props) => {
    const handleDelete = () => {
      if (window.confirm(`delete ${props.person['name']}?`)) {
        personsService.remove(props.person['id'])
        .then(data => {
          props.setPersons(props.persons.filter(person => person['id'] !== props.person['id']))
        })
      }
    }  
    return (
      <button onClick={handleDelete}>
        {props.text}
      </button>
    )
  }

const Person = (props) => {
  return (
    <div>
    <li>{props.person['name']} {props.person['number']}</li>
    <Button text="delete" setPersons={props.setPersons} person={props.person} persons={props.persons} />
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    console.log('effect')
    personsService.getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])  


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    let existingNames = persons.map(person => person['name'])
    if (existingNames.includes(newName)) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {name: newName, number: newNumber}
      personsService.create(newPerson)
        .then(data => {
          setPersons(persons.concat(data))
          setNewName('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <input value={newFilter} onChange={handleFilterChange}/>
      <h2>Add a new number</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.filter(person => person.name.toLowerCase().startsWith(newFilter.toLowerCase()))
          .map(person =>
           <Person key={person['name']} person={person} setPersons={setPersons} persons={persons} />
          )
        }
      </ul>
    </div>
  )
}

export default App