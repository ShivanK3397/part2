
import { useState } from 'react'
import { useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteService from "./services/notes"
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null);

  const hook = () => {
    //console.log('effect');
    const notes = noteService.getAll().then(intialNotes=>{
      setNotes(intialNotes);
    })
  }

  useEffect(hook,[])
  if (!notes) { 
    return null 
  }

  //console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
   
    }

    noteService.create(noteObject).then(response=>{
      setNotes(notes.concat(response));
      setNewNote("")
    })
  
  
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {

        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message = {errorMessage}/>
      <div>
        
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={()=>{
            toggleImportanceOf(note.id);
          }} />
        )}
      </ul>
      <form onSubmit={addNote}>
      <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer/> 
    </div> 
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

export default App

// import { useState, useEffect } from 'react'
// import axios from 'axios'

// const App = () => {
//   const [value, setValue] = useState('')
//   const [rates, setRates] = useState({})
//   const [currency, setCurrency] = useState(null)

//   useEffect(() => {
//     console.log('effect run, currency is now', currency)

//     // skip if currency is not defined
//     if (currency) {
//       console.log('fetching exchange rates...')
//       axios
//         .get(`https://open.er-api.com/v6/latest/${currency}`)
//         .then(response => {
//           setRates(response.data.rates)
//         })
//     }
//   }, [currency])

//   const handleChange = (event) => {
//     setValue(event.target.value)
//   }

//   const onSearch = (event) => {
//     event.preventDefault()
//     setCurrency(value)
//   }

//   return (
//     <div>
//       <form onSubmit={onSearch}>
//         currency: <input value={value} onChange={handleChange} />
//         <button type="submit">exchange rate</button>
//       </form>
//       <pre>
//         {JSON.stringify(rates, null, 2)}
//       </pre>
//     </div>
//   )
// }

// export default App