import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  entryCollection!: AngularFirestoreCollection;
  private entryDoc!: AngularFirestoreDocument;



  constructor(
    private afs: AngularFirestore,
  ) { }

  /**
   * General tool to get documents from a table in firebase
   * @param table the DB_CONFIG table you are searching. REQUIRED
   * @param sortBy the field name you'd like to sort by.
   * @param descending set to true if you'd like the sort by to be descending
   * @param whereField the field name you'd like to search
   * @param whereTruth the field value for your whereField you're searching for
   * @returns an observable to subscribe to
   */
   getEntries(table: string, sortBy?: string, descending?: boolean, whereField?: string, whereTruth?: any) {
    let orderByOption = 'asc' as any;
    if (descending) {
      orderByOption = 'desc';
    }

    if ( whereField && whereTruth) {
      this.entryCollection = this.afs.collection(
        table,
        ref => ref.where(whereField, '==', whereTruth)
      );
    } else if (sortBy) {
      this.entryCollection = this.afs.collection(
        table,
        ref => ref.orderBy(sortBy, orderByOption)
      );
    }

    const entryData = this.entryCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            // Get document data
            const data = a.payload.doc.data();

            // Get document id
            const id = a.payload.doc.id;

            // Use spread operator to add the id to the document data
            return { id, ...data } as any;
          });
        })
      );
      return entryData;
  }

  /**
   * saves entry to our database
   * @param entry the entry to save to the database
   * @param table the table to save to. use 'DB_CONFIG' to find endpoints. under src/environments/environment.ts
   * @returns a promise that returns id on success. otherwise throws an error
   */
  async saveEntry(entry: any, table: string) {
    if(!entry.createdDate) {
      entry.createdDate = new Date().toString();
    }
    entry.modifiedDate = new Date().toString();
    this.entryCollection = await this.afs.collection(table);

    try {
      const res = await this.entryCollection.add({...entry});
      return res.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * get entry from DB based on the id
   * @param id entry id
   * @returns a promise that returns the obj + id
   */
  getEntryById(id: string, table: string) {
    this.entryCollection = this.afs.collection(table);
    return Promise.resolve(this.entryCollection.doc(id).ref.get().then((doc) => {
      let retVal = doc.data() as any;
      retVal = {...retVal, id: doc.id};
      return retVal;
    }));
  }

  /**
   * get a reference to the DB and update it with changes
   * @param entry any object
   * @param table the db config endpoint
   * @returns a promise that returns the id of the entry, likely never needed. id shouldnt change
   */
  async updateEntry(entry: any, table: string) {
    const path =  table + '/' + entry.id;
    // actually update the modified date now
    entry.modifiedDate = new Date();

    this.entryDoc = this.afs.doc<any>(path);
    await this.entryDoc.update(entry);
    return entry.id;
  }

  /**
   * removes a entry from DB
   * @param entry any object saved to db, MUST HAVE ID
   * @param table the db endpoint for the entry
   * @returns returns a promise that returns on completion. throws error if it fails
   */
  async deleteEntry(entry: any, table: string) {
    if(!entry.id) {
      throw Error('Id must exist on entry. AdminService.DeleteEntry')
    }
    this.entryCollection = this.afs.collection(table);

    try {
      const res = await this.entryCollection.doc(entry.id).delete();
      return res;
    } catch (error) {
      throw error;
    }
  }
}
