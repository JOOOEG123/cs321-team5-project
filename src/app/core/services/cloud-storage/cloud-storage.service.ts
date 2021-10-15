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

  async uploadToUsersImages(file: File) {
    // Random Num generate for file name uses date since it should be impossible to overwrite a file,
    // besides a mass upload within seconds
    const now = new Date().toUTCString();
    const user = await this.auth.currentUser;
    const ref = this.afs.ref(`${user?.uid}/${now}`);
    const task = ref.put(file);
    task.percentageChanges().subscribe(percent => {
      this.uploadProgress = percent;
      console.log(percent)
    });
    await task;
    return ref.getDownloadURL();

  }
}
