"use client";

import { useState, useEffect } from "react";
import { Ga4Site } from "@/lib/ga4/overview";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Ga4Site;
}

/**
 * Modal para gestionar notas diarias por sitio
 * Las notas se almacenan en localStorage con clave: vmomentum-notes::<site>::<YYYY-MM-DD>
 */
export function NotesModal({ isOpen, onClose, site }: NotesModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Fecha de hoy en formato YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveMessage, setShowSaveMessage] = useState<boolean>(false);

  // Cargar notas cuando cambia la fecha o el sitio
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Usar setTimeout para evitar setState sincrónico en efecto
    const timer = setTimeout(() => {
      const storageKey = `vmomentum-notes::${site}::${selectedDate}`;
      const savedNotes = localStorage.getItem(storageKey);
      setNotes(savedNotes || "");
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, selectedDate, site]);

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

  const handleSave = () => {
    if (isSaving) return;

    setIsSaving(true);
    const storageKey = `vmomentum-notes::${site}::${selectedDate}`;
    
    try {
      localStorage.setItem(storageKey, notes);
      setIsSaving(false);
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving notes:", error);
      setIsSaving(false);
    }
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
        className="bg-vm-card border border-vm-border rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col shadow-2xl"
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
              Notes for this day
            </label>
            <textarea
              id="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Notes saved.
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
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium text-white bg-vm-primary rounded-full hover:bg-vm-primarySoft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

