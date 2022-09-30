import { serializable } from 'serializr';

export interface IDocument {
  _docId: string;
}

export abstract class FirestoreDocument implements IDocument {
  @serializable
  _docId!: string;
  constructor() {}
}
