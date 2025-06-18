import React, { useState } from "react";
import { addNote } from "../services/noteService";

type Props = {
  onClose: () => void;
  onNoteAdded: () => void;
};

const AddNote: React.FC<Props> = ({ onClose, onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const colors = ["bg-yellow", "bg-orange", "bg-green", "bg-blue", "bg-purple"];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    await addNote({ title, body, color: randomColor });
    setTitle("");
    setBody("");
    onNoteAdded();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="edit-input"
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="edit-textarea"
          />
          <div className="edit-buttons">
            <button type="submit" className="save-btn">
              Add
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
