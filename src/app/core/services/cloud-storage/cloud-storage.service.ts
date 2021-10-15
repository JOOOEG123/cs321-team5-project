import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  uploadProgress = 0 as number | undefined;
  downloadUrl: any;

  constructor(
    private afs: AngularFireStorage,
    private auth: AngularFireAuth
  ) { }

  /**
   * takes a file object and uploads it to a users folder for the map, maybe should have another folder of maps?
   * @param file the file object you'd like to save(event.target.files[0])
   * @returns the reference string to where the file is saved
   */
  async uploadToUsersImages(file: File) {
    // Random Num generate for file name
    const randomId = Math.random().toString(36).substring(2);
    const user = await this.auth.currentUser;
    const ref = this.afs.ref(`${user?.uid}/${randomId}`);
    const task = ref.put(file);
    task.percentageChanges().subscribe(percent => {
      this.uploadProgress = percent;
      console.log(percent)
    });
    await task;
    return `${user?.uid}/${randomId}`;
  }

  /**
   * gets an image url from a reference string
   * @param refStr reference string to where an image is located on cloud storage
   * @returns an observable to subscribe to that will get you a url
   */
  getImageFromRef(refStr: string) {
    const ref = this.afs.ref(refStr);
    return ref.getDownloadURL();
  }

  /**
   * Removes image from cloud storage based on reference string
   * @param refStr reference string to where an image is located on cloud storage
   * @returns an observable to subscribe to that will tell you if the deletion was successful(?)
   */
  removeImage(refStr: string) {
    if(refStr === '') {
      return;
    }
    const ref = this.afs.ref(refStr);
    return ref.delete()
  }
}
