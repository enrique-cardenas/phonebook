import React from 'react'
import Button from './Button'

const Person = ({person, removePerson}) => {
  return(
    <div>
      {`${person.name} ${person.number}`} 
      <Button text='delete' onClick={removePerson(person.id)}/>
    </div>
  )
}

export default Person