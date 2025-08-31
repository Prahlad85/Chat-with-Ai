export type View = 'chat' | 'image' | 'summarizer';

export enum MessageAuthor {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  author: MessageAuthor;
  text: string;
}
