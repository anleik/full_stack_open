import React, { useState, useEffect } from 'react'
import personService from './personService'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmation = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )
      if (confirmation) {
        personService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(prevPersons =>
              prevPersons.map(person =>
                person.id === existingPerson.id ? updatedPerson : person
              )
            )
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error('Error updating person:', error)
          })
      }
    } else {
      // Add new person if not found
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(prevPersons => prevPersons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert('Error adding person:', error)
        })
    }
  }

  const deletePerson = (id, name) => {
    const confirmation = window.confirm(`Delete ${name}?`)

    if (confirmation) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error)
        })
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App