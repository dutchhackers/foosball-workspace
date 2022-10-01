// TODO: refactor out serializer
import { deserialize, ClazzOrModelSchema } from 'serializr';

export abstract class CoreService {
  //privates?
  db: FirebaseFirestore.Firestore;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
  }

  protected wrapAll<T>(snapshot: FirebaseFirestore.QuerySnapshot, modelschema: ClazzOrModelSchema<T> | null = null): T[] {
    const docs: T[] = [];
    for (const doc of snapshot.docs) {
      if (modelschema) {
        docs.push(this.serializeDocument<T>(modelschema, doc));
      } else {
        docs.push(<T>doc.data());
      }
    }
    return docs;
  }

  protected async getDocumentAsObject<T>(
    docRef: FirebaseFirestore.DocumentReference,
    modelschema: ClazzOrModelSchema<T>
  ): Promise<T | null> {
    const snapshot = await docRef.get();
    if (snapshot !== null) {
      return this.serializeDocument<T>(modelschema, snapshot);
    }
    return null;
  }

  protected async firebaseSetDocument(docRef: FirebaseFirestore.DocumentReference, data: any): Promise<any> {
    const _data = cleanInput(data);
    return docRef.set(_data);
  }

  protected serializeDocument<T>(
    modelschema: ClazzOrModelSchema<T>,
    snapshot: FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot
  ): T {
    return Object.assign(deserialize(modelschema, snapshot.data()), { _docId: snapshot.id });
  }
}

function cleanInput(input: any, options: any = {}): any {
  Object.keys(input).forEach(key => (input[key] === undefined ? delete input[key] : ''));
  return input;
}
