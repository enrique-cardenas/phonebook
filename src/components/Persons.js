import React from 'react'
import Person from './Person'

const Persons = ({personsToShow, removePerson}) => {
  return (
    <>
      {personsToShow.map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
    </>
  )
}

export default Persons