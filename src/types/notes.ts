export interface Highlight {
  id: string;
  lessonId: string;
  userId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  color: string;
  createdAt: string;
  note?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  position: number;
  highlightId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
}