import { Component } from '@angular/core';
import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
declare var LocalNotification: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  registeredLat: any;
  registeredLon: any;
  currentLat: any;
  currentLon: any;

  constructor(
    private geofence: Geofence,
    private geolocation: Geolocation,
    private localNotifications: LocalNotifications,
    private backgroundGeolocation: BackgroundGeolocation) {
    // this.geolocation.watchPosition().subscribe(position => {
    //   if ((position as Geoposition).coords != undefined) {
    //     let geoposition = (position as Geoposition);
    //     this.currentLat = geoposition.coords.latitude;
    //     this.currentLon = geoposition.coords.longitude;
    //     let distance = this.calcDistance(this.currentLat, this.currentLon, this.registeredLat, this.registeredLon);

    //     if (distance < 0.5) {
    //       // Schedule a local notification
    //       this.localNotifications.schedule({
    //         id: 1,
    //         title: 'Welcome to Jeddah Airport',
    //         text: 'Dear Employee \nWelcome to Jeddah Airport, Hope you have a wonderful experience with SAUDIA'
    //       });
    //     }


    //     alert("Current Latitude & Longitude:" + this.currentLat + " " + this.currentLon + "\n" +
    //       "Registered Latitude & Longitude: " + this.registeredLat + " " + this.registeredLon + "\n" +
    //       "Distance in Mtrs: " + distance);
    //   }
    // });

    //subscribe for geofence location transition
    //this.addGeofence();

  }


  // addGeofence() {
  //   //this.geofence.removeAll();
  //   this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
  //     //options describing geofence
  //     let fence = {
  //       id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
  //       latitude: data.coords.latitude, //center of geofence radius
  //       longitude: data.coords.longitude,
  //       //latitude: 8.539574, //center of geofence radius
  //       //longitude: 77.766876,
  //       radius: 50, //radius to edge of geofence in meters
  //       transitionType: 3, //see 'Transition Types' below
  //       notification: { //notification settings
  //         id: 1, //any unique ID 
  //         title: 'Welcome to Jeddah Airport', //notification title
  //         text: 'Dear Employee \nWelcome to Jeddah Airport, Hope you have a wonderful experience with SAUDIA', //notification body
  //         openAppOnClick: true //open app when notification is tapped
  //       }
  //     }

  //     this.geofence.addOrUpdate(fence).then(() => {
  //       this.registeredLat = data.coords.latitude;
  //       this.registeredLon = data.coords.longitude;
  //       alert('Geofence added for ' + this.registeredLat + " " + this.registeredLon);
  //     }, (err) => {
  //       console.log('Geofence failed to add', err);
  //     });

  //     this.geofence.onTransitionReceived().subscribe(resp => {
  //       alert(resp);
  //     });
  //   });
  // }

  registerMyLocation() {
    this.geolocation.getCurrentPosition().then(data => {
      this.registeredLat = data.coords.latitude;
      this.registeredLon = data.coords.longitude;
    });

    this.enableTracking();
  }

  enableTracking() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 10,
      distanceFilter: 10,
      interval: 3000,
      fastestInterval: 3000,
      startForeground: true,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        console.log(location);
        
        this.currentLat = location.latitude;
        this.currentLon = location.longitude;
        let distance = this.calcDistance(this.currentLat, this.currentLon, this.registeredLat, this.registeredLon);

        if (distance > 0.25) {
          let options = {
            "title": 'Welcome to Jeddah Airport',
            "message": 'Dear Employee \nWelcome to Jeddah Airport, Hope you have a wonderful experience with SAUDIA',
          };

          //Display local notification
          LocalNotification.invoke(options, (res) => {
            console.log(res);
          }, (err) => {
            console.log(err);
          });

          // stop recording location
          this.backgroundGeolocation.stop();
        } 
       
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });
    });

    // start recording location
    this.backgroundGeolocation.start();
  }

  // getDistanceFromLatLonInKm(current_lat, current_lon, jeddah_lat, jeddah_lon) {
  //   var R = 6371; // Radius of the earth in km
  //   var dLat = this.deg2rad(jeddah_lat - current_lat);  // deg2rad below
  //   var dLon = this.deg2rad(jeddah_lon - current_lon);
  //   var a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.deg2rad(current_lat)) * Math.cos(this.deg2rad(jeddah_lat)) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   var d = R * c; // Distance in km
  //   return d;
  // }

  // deg2rad(deg) {
  //   return deg * (Math.PI / 180)
  // }

  calcDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
    }
  }

}
