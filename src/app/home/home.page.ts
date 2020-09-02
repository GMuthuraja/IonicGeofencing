import { Component } from '@angular/core';
import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  registeredLat: any;
  registeredLong: any;

  constructor(
    private geofence: Geofence,
    private geolocation: Geolocation) {

    setInterval(() => {
      this.geolocation.getCurrentPosition().then(data => {
        alert("Current Latitude & Longitude:" + data.coords.latitude + " " + data.coords.longitude + "\n" +
          "Geofence Registered Latitude & Longitude: " + this.registeredLat + " " + this.registeredLong);
      });
    }, 15000);

    //subscribe for geofence location transition
    this.addGeofence();
  }

  addGeofence() {
    //this.geofence.removeAll();
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
      //options describing geofence
      let fence = {
        id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
        latitude: data.coords.latitude, //center of geofence radius
        longitude: data.coords.longitude,
        //latitude: 8.539574, //center of geofence radius
        //longitude: 77.766876,
        radius: 50, //radius to edge of geofence in meters
        transitionType: 3, //see 'Transition Types' below
        notification: { //notification settings
          id: 1, //any unique ID 
          title: 'Welcome to Jeddah Airport', //notification title
          text: 'Dear Employee \nWelcome to Jeddah Airport, Hope you have a wonderful experience with SAUDIA', //notification body
          openAppOnClick: true //open app when notification is tapped
        }
      }

      this.geofence.addOrUpdate(fence).then(() => {
        this.registeredLat = data.coords.latitude;
        this.registeredLong = data.coords.longitude;
        alert('Geofence added for ' + this.registeredLat + " " + this.registeredLong);
      }, (err) => {
        console.log('Geofence failed to add', err);
      });

      this.geofence.onTransitionReceived().subscribe(resp => {
        console.log(resp);
      });
    });
  }

}
