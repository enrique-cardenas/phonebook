import React from 'react'
import Person from './Person'

const People = ({peopleToShow}) => {
  return (
    <>
      {peopleToShow.map(person => <Person key={person.name} person={person} />)}
    </>
  )
}

export default People