import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'
import peopleService from './services/people' 

const App = () => {

  const [ people, setPeople] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    peopleService
      .getAll()
      .then(initialPeople => {
        setPeople(initialPeople)
      })
  }, [])

  const peopleToShow = people.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  
  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: people.length + 1
    }

    if(people.find(person => person.name === newName)){

      const name = personObject.name

      if(window.confirm(`${name} is already in the phonebook, would you like to replace the old number with a new one?`)){
        const indexOfPersonToChange = people.findIndex(person => person.name === name)
        const changedPerson = {...people[indexOfPersonToChange], number: newNumber}
        const updatedPeople = [...people]
        updatedPeople[indexOfPersonToChange].number = newNumber
        peopleService
          .update(changedPerson)
          .then(response => setPeople(updatedPeople))
      }
      
    }
    else{
      peopleService
        .create(personObject)
        .then(data => {
          setPeople(people.concat(personObject))
          setNewName('')
        })
    }
  }

  const removePerson = (id) => () => {
    const personToDelete = people.find(person => person.id === id);
    if(window.confirm(`Delete ${personToDelete.name}?`)){
      peopleService.remove(id);
      setPeople(people.filter(person => person.id !== id))
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <People peopleToShow={peopleToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App  