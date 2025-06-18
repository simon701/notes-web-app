import React, { useEffect, useState, useRef } from "react";
import { deleteNote, getNotes, updateNote } from "../services/noteService";
import AddNote from "./AddNote";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

type Note = {
  title: string;
  body: string;
  color?: string;
};

const ListNotes: React.FC = () => {
  const cardRef = useRef<HTMLLIElement | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<Note>({ title: "", body: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setEditingTitle(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  const startEditing = (note: Note) => {
    setEditingTitle(note.title);
    setEditedNote(note);
  };

  const deletePrompt = (title: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${title}"`
    );
    if (confirm) {
      handleDelete(title);
    }
  };

  const handleDelete = async (title: string) => {
    await deleteNote(title);
    fetchNotes();
    setEditingTitle(null);
  };

  const update = async () => {
    if (!editingTitle) return;
    await updateNote(editingTitle, {
      title: editedNote.title,
      body: editedNote.body,
    });
    setEditingTitle(null);
    fetchNotes();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Notes Web App</h1>
      <h2 style={{ marginTop: 0 }}>My Notes</h2>
      {isModalOpen && (
        <AddNote
          onClose={() => setIsModalOpen(false)}
          onNoteAdded={fetchNotes}
        />
      )}
      <ul className="note-grid">
        {notes.map((note) => {
          const cardColor = note.color || "bg-yellow";
          const isEditing = editingTitle === note.title;

          return (
            <li
              key={note.title}
              className={`note-card ${cardColor}`}
              ref={isEditing ? cardRef : null}
            >
              {isEditing ? (
                <>
                  <input
                    className="edit-input"
                    value={editedNote.title}
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, title: e.target.value })
                    }
                  />
                  <textarea
                    className="edit-textarea"
                    value={editedNote.body}
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, body: e.target.value })
                    }
                  />
                  <div className="edit-buttons">
                    <button className="save-btn" onClick={update}>
                      <FaCheck />
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingTitle(null)}
                    >
                      <FaTimes />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deletePrompt(note.title)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => startEditing(note)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-body">{note.body}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        +
      </button>
    </div>
  );
};

export default ListNotes;
