"use client";

import { useState, useEffect } from "react";
import { Ga4Site } from "@/lib/ga4/overview";
import { Note, getNotes, saveNote, generateNoteId } from "@/lib/notes";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Ga4Site;
}

/**
 * Modal para gestionar historial de notas por sitio
 * Las notas se almacenan en localStorage con clave: vmomentum-notes::<site>
 */
export function NotesModal({ isOpen, onClose, site }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [noteContent, setNoteContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveMessage, setShowSaveMessage] = useState<boolean>(false);

  // Cargar notas cuando se abre el modal o cambia el sitio
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      const loadedNotes = getNotes(site);
      setNotes(loadedNotes);
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, site]);

  // Cargar nota seleccionada
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedNoteId) {
        const note = notes.find((n) => n.id === selectedNoteId);
        if (note) {
          setSelectedDate(note.date);
          setNoteContent(note.content);
        }
      } else {
        // Nueva nota: resetear fecha a hoy y contenido vacío
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]);
        setNoteContent("");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedNoteId, notes]);

  // Cerrar modal con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNewNote = () => {
    setSelectedNoteId(null);
    const today = new Date();
    setSelectedDate(today.toISOString().split("T")[0]);
    setNoteContent("");
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleSave = () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const noteToSave: Note = {
        id: selectedNoteId || generateNoteId(),
        date: selectedDate,
        content: noteContent.trim(),
      };

      const updatedNotes = saveNote(site, noteToSave);
      setNotes(updatedNotes);
      
      // Si era una nota nueva, seleccionarla después de guardar
      if (!selectedNoteId) {
        setSelectedNoteId(noteToSave.id);
      }

      setIsSaving(false);
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving note:", error);
      setIsSaving(false);
    }
  };

  const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const getNotePreview = (content: string): string => {
    const trimmed = content.trim();
    if (trimmed.length === 0) return "(Empty note)";
    if (trimmed.length <= 50) return trimmed;
    return trimmed.substring(0, 50) + "...";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      aria-labelledby="notes-modal-title"
    >
      <div
        className="bg-vm-card border border-vm-border rounded-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-vm-border">
          <h2
            id="notes-modal-title"
            className="text-xl font-semibold text-vm-textMain"
          >
            Notes
          </h2>
          <button
            onClick={onClose}
            className="text-vm-textMuted hover:text-vm-textMain transition-colors p-1"
            aria-label="Close notes modal"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar - Lista de notas */}
          <div className="w-64 border-r border-vm-border flex flex-col bg-vm-bgSoft/20">
            <div className="p-4 border-b border-vm-border">
              <button
                onClick={handleNewNote}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-vm-primary rounded-full hover:bg-vm-primarySoft transition-colors"
              >
                + New note
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-vm-textMuted">No notes yet</p>
                  <p className="text-xs text-vm-textMuted mt-2">
                    Click &quot;New note&quot; to create one
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedNoteId === note.id
                          ? "bg-vm-primary/20 border-vm-primary/50"
                          : "bg-vm-card/60 border-vm-border hover:border-vm-primary/30"
                      }`}
                    >
                      <div className="text-xs font-medium text-vm-textMain mb-1">
                        {formatDateShort(note.date)}
                      </div>
                      <div className="text-xs text-vm-textMuted line-clamp-2">
                        {getNotePreview(note.content)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main area - Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Date selector */}
              <div>
                <label
                  htmlFor="notes-date"
                  className="block text-sm font-medium text-vm-textMain mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="notes-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 bg-vm-bgSoft border border-vm-border rounded-lg text-vm-textMain focus:outline-none focus:ring-2 focus:ring-vm-primary/50 focus:border-vm-primary/50"
                />
              </div>

              {/* Notes textarea */}
              <div>
                <label
                  htmlFor="notes-textarea"
                  className="block text-sm font-medium text-vm-textMain mb-2"
                >
                  {selectedNoteId ? "Edit note" : "New note"}
                </label>
                <textarea
                  id="notes-textarea"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-vm-bgSoft border border-vm-border rounded-lg text-vm-textMain placeholder-vm-textMuted focus:outline-none focus:ring-2 focus:ring-vm-primary/50 focus:border-vm-primary/50 resize-none"
                  placeholder="Write your notes here..."
                />
              </div>

              {/* Info text */}
              <p className="text-xs text-vm-textMuted">
                Notes are stored locally in this browser only. They are not synced to the server yet.
              </p>

              {/* Save message */}
              {showSaveMessage && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-sm text-green-400">
                  Note saved.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-vm-border">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-vm-textMuted hover:text-vm-textMain transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !noteContent.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-vm-primary rounded-full hover:bg-vm-primarySoft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : selectedNoteId ? "Update note" : "Save note"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
