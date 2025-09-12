import React, { useState, useRef } from 'react';
import { Highlight, Note, TextSelection } from '../../types/notes';
import { v4 as uuidv4 } from 'uuid';

interface TextHighlighterProps {
  content: string;
  lessonId: string;
  userId: string;
  highlights: Highlight[];
  notes: Note[];
  onHighlight: (highlight: Highlight) => void;
  onNote: (note: Note) => void;
}

const HIGHLIGHT_COLORS = ['#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#e91e63'];

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  content,
  lessonId,
  userId,
  highlights,
  notes,
  onHighlight,
  onNote
}) => {
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      
      setSelectedText({
        text: selection.toString(),
        startOffset,
        endOffset
      });
    }
  };

  const createHighlight = (color: string) => {
    if (!selectedText) return;
    
    const highlight: Highlight = {
      id: uuidv4(),
      lessonId,
      userId,
      text: selectedText.text,
      startOffset: selectedText.startOffset,
      endOffset: selectedText.endOffset,
      color,
      createdAt: new Date().toISOString()
    };
    
    onHighlight(highlight);
    setSelectedText(null);
  };

  const addNote = () => {
    if (!noteContent.trim()) return;
    
    const note: Note = {
      id: uuidv4(),
      lessonId,
      userId,
      content: noteContent,
      position: selectedText?.startOffset || 0,
      highlightId: selectedText ? undefined : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onNote(note);
    setNoteContent('');
    setShowNoteInput(false);
    setSelectedText(null);
  };

  const renderContentWithHighlights = () => {
    if (!highlights.length) {
      return content
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }
    
    // Apply highlights first, then format
    const sortedHighlights = [...highlights].sort((a, b) => a.startOffset - b.startOffset);
    let result = '';
    let lastOffset = 0;
    
    sortedHighlights.forEach(highlight => {
      result += content.slice(lastOffset, highlight.startOffset);
      result += `<mark style="background-color: ${highlight.color}">${highlight.text}</mark>`;
      lastOffset = highlight.endOffset;
    });
    
    result += content.slice(lastOffset);
    
    // Format the final result
    return result
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose max-w-none p-4 select-text"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: renderContentWithHighlights() }}
      />
      
      {selectedText && (
        <div className="fixed bg-white border rounded-lg shadow-lg p-3 z-50" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="flex gap-2 mb-2">
            {HIGHLIGHT_COLORS.map(color => (
              <button
                key={color}
                className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                style={{ backgroundColor: color }}
                onClick={() => createHighlight(color)}
              />
            ))}
          </div>
          <button
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => setShowNoteInput(true)}
          >
            Add Note
          </button>
        </div>
      )}
      
      {showNoteInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="font-semibold mb-2">Add Note</h3>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note..."
            />
            <div className="flex gap-2 mt-3">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={addNote}
              >
                Save
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                onClick={() => setShowNoteInput(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {notes.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            My Notes ({notes.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notes.map(note => (
              <div key={note.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-3 rounded-r shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => {
                      // Add delete functionality if needed
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};