import { Ga4Site } from './ga4/overview';

export interface Note {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title?: string;
  content: string;
}

/**
 * Obtiene todas las notas para un sitio desde localStorage
 */
export function getNotes(site: Ga4Site): Note[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storageKey = `vmomentum-notes::${site}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Note[];
      if (Array.isArray(parsed)) {
        // Ordenar por fecha descendente (más reciente primero)
        return parsed.sort((a, b) => b.date.localeCompare(a.date));
      }
    } catch (error) {
      console.error('Error parsing notes:', error);
    }
  }

  // Intentar migrar notas antiguas (formato por fecha)
  migrateOldNotes(site);

  return [];
}

/**
 * Guarda todas las notas para un sitio en localStorage
 */
export function saveNotes(site: Ga4Site, notes: Note[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = `vmomentum-notes::${site}`;
  try {
    // Ordenar por fecha descendente antes de guardar
    const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(storageKey, JSON.stringify(sorted));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
}

/**
 * Añade o actualiza una nota
 */
export function saveNote(site: Ga4Site, note: Note): Note[] {
  const notes = getNotes(site);
  const existingIndex = notes.findIndex((n) => n.id === note.id);

  if (existingIndex >= 0) {
    // Actualizar nota existente
    notes[existingIndex] = note;
  } else {
    // Añadir nueva nota
    notes.push(note);
  }

  saveNotes(site, notes);
  return getNotes(site);
}

/**
 * Elimina una nota por ID
 */
export function deleteNote(site: Ga4Site, noteId: string): Note[] {
  const notes = getNotes(site);
  const filtered = notes.filter((n) => n.id !== noteId);
  saveNotes(site, filtered);
  // Retornar notas ordenadas (más reciente primero)
  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Genera un ID único para una nueva nota
 */
export function generateNoteId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback simple
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Migra notas del formato antiguo (por fecha) al nuevo formato (array)
 * Solo se ejecuta una vez si detecta notas antiguas
 */
function migrateOldNotes(site: Ga4Site): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = `vmomentum-notes::${site}`;
  
  // Si ya existe la nueva clave, no migrar
  if (localStorage.getItem(storageKey)) {
    return;
  }

  const migratedNotes: Note[] = [];
  const today = new Date();
  
  // Buscar notas antiguas en los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const oldKey = `vmomentum-notes::${site}::${dateStr}`;
    const oldNote = localStorage.getItem(oldKey);
    
    if (oldNote) {
      migratedNotes.push({
        id: generateNoteId(),
        date: dateStr,
        content: oldNote,
      });
      // Eliminar la nota antigua después de migrarla
      localStorage.removeItem(oldKey);
    }
  }

  if (migratedNotes.length > 0) {
    saveNotes(site, migratedNotes);
  }
}

