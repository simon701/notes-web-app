import React, { useEffect, useState, useRef } from "react";
import { deleteNote, getNotes, updateNote } from "../services/noteService";
import AddNote from "./AddNote";
import { FaCheck, FaTimes, FaTrash, FaPlus } from "react-icons/fa";

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
    <div className="p-5 max-w-[1000px] mx-auto">
      <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-center">Notes Web App</h1>
      <h2 className="mt-0 text-lg sm:text-xl font-semibold text-gray-700 text-center">
        My Notes
      </h2>
      {isModalOpen && (
        <AddNote
          onClose={() => setIsModalOpen(false)}
          onNoteAdded={fetchNotes}
        />
      )}
      <div className="pb-24">
        <ul className="flex flex-wrap gap-5 justify-center p-5 list-none m-0">
          {notes.map((note) => {
            const cardColor = note.color || "bg-yellow";
            const isEditing = editingTitle === note.title;

            return (
              <li
                key={note.title}
                className={`w-[175px] h-[175px] rounded-2xl shadow-xl p-5 overflow-hidden flex flex-col justify-start transition-transform duration-200 ease-in-out hover:-translate-y-1 ${cardColor}`}
                ref={isEditing ? cardRef : null}
              >
                {isEditing ? (
                  <>
                    <input
                      className="w-[90%] p-3 mb-2 rounded-lg text-base bg-white/90 shadow-inner text-gray-800 border-none"
                      value={editedNote.title}
                      onChange={(e) =>
                        setEditedNote({ ...editedNote, title: e.target.value })
                      }
                    />
                    <textarea
                      className="resize-y h-[100px] w-[90%] p-3 mb-2 rounded-lg text-base bg-white/90 shadow-inner text-gray-800 border-none"
                      value={editedNote.body}
                      onChange={(e) =>
                        setEditedNote({ ...editedNote, body: e.target.value })
                      }
                    />
                    <div className="flex justify-center mt-[10px]">
                      <button
                        className="flex-1 px-3 py-2 mx-1 text-white rounded-md transition-transform hover:scale-105 bg-green-600 hover:bg-green-700"
                        onClick={update}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="flex-1 px-3 py-2 mx-1 text-white rounded-md transition-transform hover:scale-105 bg-gray-500 hover:bg-gray-600"
                        onClick={() => setEditingTitle(null)}
                      >
                        <FaTimes />
                      </button>
                      <button
                        className="flex-1 px-3 py-2 mx-1 text-white rounded-md transition-transform hover:scale-105 bg-red-600 hover:bg-red-700"
                        onClick={() => deletePrompt(note.title)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => startEditing(note)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-base sm:text-lg font-bold mb-2">{note.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-800 leading-snug line-clamp-3">
                      {note.body}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <button
          className="fixed bottom-8 right-8 w-[60px] h-[60px] text-[40px] rounded-full bg-purple-600 text-white shadow-xl flex items-center justify-center hover:bg-purple-800"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ListNotes;
