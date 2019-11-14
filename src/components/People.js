import React from 'react'
import Person from './Person'

const People = ({peopleToShow, removePerson}) => {
  return (
    <>
      {peopleToShow.map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
    </>
  )
}

export default People