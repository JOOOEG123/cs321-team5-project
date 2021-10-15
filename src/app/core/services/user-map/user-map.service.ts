import { uuidv4 } from '@core/helper';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../data-storage/dataStorage.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserMapService {
  private _userMap = new BehaviorSubject<any>([]);
  readonly userMap = this._userMap.asObservable();

  constructor(
    private dataStorage: DataStorageService,
    private auth: AngularFireAuth,
    private cloudStorage: CloudStorageService
  ) {}

  getObservedUserMap(): Promise<any> {
    return this.userMap.toPromise();
  }

  async updateUserMap(mapObj: any, index?: number | undefined): Promise<any> {
    const user = await this.auth.currentUser;
    if (!mapObj.createdDate) {
      mapObj.createdDate = new Date().toString();
    }
    if(!index) {
      mapObj.uuid = user?.uid;
      mapObj.id =  uuidv4('user-map');
    }
    mapObj.modifiedDate = new Date().toString();
    try {
      const allUserMap = await this.getAllUserMaps();
      if (allUserMap?.user_maps && user) {
        const { user_maps } = allUserMap;
        if (index && user_maps) {
          user_maps[index] = mapObj;
        } else if (user_maps) {

          user_maps.push(mapObj);
        }
        this._userMap.next(user_maps);
        return this.dataStorage.addUserMap(
          { user_maps: user_maps || [mapObj] },
          user.uid
        );
      }
      this._userMap.next([mapObj]);
      return this.dataStorage.addUserMap({ user_maps: [mapObj] }, user?.uid);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserMap(index: number): Promise<any> {
    const user = await this.auth.currentUser;
    try {
      const allUserMap = await this.getAllUserMaps();
      if (allUserMap) {
        const { user_maps } = allUserMap;
        const deleted_map = user_maps[index];
        if (user_maps.length !== 0) {
          user_maps.splice(index, 1);
          this._userMap.next(user_maps);
          this.cloudStorage.removeImage(deleted_map.imageRef);
          return this.dataStorage.addUserMap({ user_maps }, user?.uid);
        }
        this._userMap.next([]);
        this.cloudStorage.removeImage(deleted_map.imageRef);
        return this.dataStorage.addUserMap({ user_maps: [] }, user?.uid);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addUserMap(mapObj: any) {
    const user = await this.auth.currentUser;
    if (!mapObj.createdDate) {
      mapObj.createdDate = new Date().toString();
    }
    mapObj.modifiedDate = new Date().toString();
    mapObj.uuid = user?.uid;
    mapObj.id =  uuidv4('user-map');
    try {
      return this.dataStorage.addUserMap({ user_maps: mapObj }, user?.uid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllUserMaps() {
    const user = await this.auth.currentUser;
    const data = (
      await this.dataStorage.getUserMap(user?.uid).toPromise()
    ).data();
    this._userMap.next(data?.user_maps || []);
    return data;
  }

  async getUserMapByIndex(index: number | undefined) {
    try {
      const allUserMap = await this.getAllUserMaps();
      if (allUserMap) {
        const { user_map } = allUserMap;
        if (user_map.length !== 0 && index) {
          return user_map[index];
        }
      }
      return {};
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
