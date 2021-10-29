import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Pin } from '@core/models/map-tracker.model';
import { BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../data-storage/dataStorage.service';

@Injectable({
  providedIn: 'root',
})
export class UserPinsService {
  private _userPin = new BehaviorSubject<Pin[]>([]);
  readonly userPin = this._userPin.asObservable();

  constructor(
    private auth: AngularFireAuth,
    private dataStorage: DataStorageService
  ) {}

  getObservedUserPins(): Promise<any> {
    return this.userPin.toPromise();
  }

  async updateUserMap(
    pins: Pin[],
    mapId: string | undefined,
    index?: number | undefined
  ): Promise<any> {
    const user = await this.auth.currentUser;
    if (!mapId) throw new Error('[Error] - map id was not passed.');
    try {
      const allUserPin = await this.getAllUserPins(mapId);
      if (allUserPin?.user_maps && user) {
        const { user_pins } = allUserPin;
        if (index && user_pins) {
          user_pins[index] = pins;
        } else if (user_pins) {
          user_pins.push(pins);
        }
        this._userPin.next(user_pins);
        return this.dataStorage.addUserPins(pins, user.uid, mapId);
      }
      this._userPin.next(pins);
      return this.dataStorage.addUserPins(pins, user?.uid, mapId);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserMap(index: number, mapId: string): Promise<any> {
    const user = await this.auth.currentUser;
    try {
      const allUserPin = await this.getAllUserPins(mapId);
      if (allUserPin) {
        const { user_pins } = allUserPin;
        if (user_pins.length !== 0) {
          user_pins.splice(index, 1);
          this._userPin.next(user_pins);
          return this.dataStorage.addUserPins(user_pins, user?.uid, mapId);
        }
        this._userPin.next([]);
        return this.dataStorage.addUserPins([], user?.uid, mapId);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllUserPins(mapId: string) {
    const user = await this.auth.currentUser;
    const data = (
      await this.dataStorage.getUserPin(user?.uid, mapId).toPromise()
    ).data();
    this._userPin.next(data?.user_pins || []);
    return data;
  }

  async getUserMapByIndex(index: number | undefined, mapId: string) {
    try {
      const allUserPin = await this.getAllUserPins(mapId);
      if (allUserPin) {
        const { user_pins } = allUserPin;
        if (user_pins.length !== 0 && index) {
          return user_pins[index];
        }
      }
      return {};
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
