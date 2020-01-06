import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons' 
import Notification from './components/Notification'

const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  
  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    if(persons.find(person => person.name === newName)){

      const name = personObject.name

      if(window.confirm(`${name} is already in the phonebook, would you like to replace the old number with a new one?`)){
        const indexOfPersonToChange = persons.findIndex(person => person.name === name)
        const changedPerson = {...persons[indexOfPersonToChange], number: newNumber}
        const updatedPersons = [...persons]
        updatedPersons[indexOfPersonToChange].number = newNumber
        personsService
          .update(changedPerson)
          .then(response => {
            setPersons(updatedPersons)
            setNotificationMessage(`Updated ${personObject.name}`)
            setNotificationType("update")
          })
          .catch(error => {
            setNotificationMessage(`Information on ${personObject.name} has already been removed from server`)
            setNotificationType("error")
          })
      }

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    else{
      personsService
        .create(personObject)
        .then(data => {
          setPersons(persons.concat(personObject))
          setNewName('')
          setNotificationMessage(`Added ${newName}`)
          setNotificationType("add")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNewName('')
          setNotificationMessage(`${error.response.data.errror}`)
          setNotificationType('error')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const removePerson = (id) => () => {
    const personToDelete = persons.find(person => person.id === id);
    if(window.confirm(`Delete ${personToDelete.name}?`)){
      personsService.remove(id);
      setPersons(persons.filter(person => person.id !== id))
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

      <Notification message={notificationMessage} type={notificationType} />

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App  