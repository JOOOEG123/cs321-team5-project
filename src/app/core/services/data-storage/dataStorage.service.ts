import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

constructor(private httpClient: HttpClient) { }

  async getCountry() {
    return await this.getAPI('https://restcountries.eu/rest/v2/all');
  }

  private getAPI<T>(path:any, params?:any) {
    return this.httpClient.get<T>(path).toPromise();
  }
}
