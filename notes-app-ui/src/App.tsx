
import { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number,
  title: string;
  content: string;
}

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newNote = {
        title,
        content
      };
     console.log('newNote',newNote);
      await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newNote)
      }).then(() => {
        fetchNotes();
        setTitle("");
        setContent("")
      })
     
    } catch (e) {
      console.log(e);
    }

  }

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }
    const id = selectedNote?.id || null;
    try {
      await fetch("http://localhost:5000/api/notes/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      }).then(() => {
        fetchNotes();
        setTitle("");
        setContent("");
        setSelectedNote(null);
      });
    } catch (e) {
      console.log(e);
    }
  }


  const deleteNote = async(event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      await fetch("http://localhost:5000/api/notes/" + noteId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(() => {
        fetchNotes();
        if (selectedNote) {
          setTitle("");
          setContent("");
          setSelectedNote(null);
        }
      });

    } catch (e) {
      console.log(e);
    }
  }

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content)
  }
  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      const notes: Note[] = await response.json();
      setNotes(notes);
    } catch (e) {
      console.log(e);
    }

  }
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  useEffect(() => {

    fetchNotes();
  }, []);
  const [notes, setNotes] = useState<Note[]>([]);
  return (
    <div className="app-container">
      <form className="note-form" onSubmit={(event) => selectedNote ? handleUpdateNote(event) : handleAddNote(event)}>
        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder='Title' required />
        <textarea rows={10} value={content} onChange={(event) => setContent(event.target.value)} placeholder='Content' required></textarea>
        {selectedNote ? (<div className="edit-buttons"><button type="submit">Save</button><button type="button" onClick={handleCancel}>Cancel</button></div>) : (<button type="submit">Add Notes</button>)}

      </form>
      <div className='notes-grid'>
        {notes.map((note) => (
          <div className='note-item' onClick={() => handleNoteClick(note)}>
            <div className='notes-header'>
              <button type="button" onClick={(event) => deleteNote(event, note.id)}>X</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
