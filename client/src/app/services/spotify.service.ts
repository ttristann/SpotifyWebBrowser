import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {

    const link = this.expressBaseUrl  + endpoint;
    return new Promise((resolve,reject)=> {
      this.http.get(link)
      .toPromise()
      .then((intial_callback)=> {
        resolve(intial_callback);
      })
      .catch((error)=>{
        reject(error);
      })
    });
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch() and using Promise().
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().

    let encoded_resource = encodeURIComponent(resource);
    console.log("category: ", category);
    let to_send=  '/search/' + category + '/' + encoded_resource;
    let data_array: ResourceData[] = [];
    return this.sendRequestToExpress(to_send).then((data) => {
      if(category == "artist"){
        data_array =  data["artists"]["items"].map((artist) => {return new ArtistData(artist)});
      }else if(category == "album"){
        data_array =  data["albums"]["items"].map((album) => {return new AlbumData(album)});
      }else if(category == "track"){
        data_array =  data["tracks"]["items"].map((track) => {return new TrackData(track)});
      }
      return data_array;
    });
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    

  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    let encoded_resource = encodeURIComponent(artistId);
    let to_send=  '/artist/' + encoded_resource;

    return this.sendRequestToExpress(to_send).then((data)=>{
      return new ArtistData(data);
    })


  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    let encoded_resource = encodeURIComponent(artistId);
    let to_send = '/artist-related-artists/' + encoded_resource;
    let data_array: ArtistData[] = [];
    return this.sendRequestToExpress(to_send).then((data)=>{
      data_array = data["artists"].map((artist)=>{
        return new ArtistData(artist);
      })
      return data_array;
    })
  

   
  }
  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(artistId);
    let to_send = '/artist-top-tracks/' + encoded_resource;
    let data_array: TrackData[] = [];
    return this.sendRequestToExpress(to_send).then((data) => {
      data_array = data["tracks"].map((track) => {
        return new TrackData(track);
      })

      return data_array;
  })

}

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(artistId);
    let to_send = '/artist-albums/' + encoded_resource;
    let data_array: AlbumData[] = [];
    return this.sendRequestToExpress(to_send).then((data) => {
      data_array = data["items"].map((album) => {
        return new TrackData(album);
      })

      return data_array;
  })

  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(albumId);
    let to_send = '/album/' + encoded_resource;
    return this.sendRequestToExpress(to_send).then((data) => {
      return new AlbumData(data);
    })
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(albumId);
    let to_send = '/album-tracks/' + encoded_resource;
    let data_array: TrackData[] = [];

    return this.sendRequestToExpress(to_send).then((data) => {
      console.log("SKRRRRT");
      console.log(data);
      data_array = data['items'].map((songs) => {
        return new TrackData(songs);
    })

    return data_array;
  });

  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(trackId);
    let to_send = '/track/' + encoded_resource;
    return this.sendRequestToExpress(to_send).then((data) => {
      return new TrackData(data);
    })
  }
  

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    let encoded_resource = encodeURIComponent(trackId);
    let to_send = '/track-audio-features/' + encoded_resource;
    let data_array: TrackFeature[] = [];
    let discovred_set = [];
    return this.sendRequestToExpress(to_send).then((data) => {
      console.log("fyuyuftufgy", Object.keys(data).length);

      for(let i = 0; i < 7; i++){
        console.log("here");
        if("danceability" in data && !(discovred_set.includes("danceability")) ){
          data_array.push(new TrackFeature('danceability', data['danceability']));
          console.log("here2");

          discovred_set.push('danceability');
        };
        if("instrumentalness" in data && !(discovred_set.includes("instrumentalness")) ){
          data_array.push(new TrackFeature('instrumentalness', data['instrumentalness']));
          discovred_set.push('instrumentalness');
        };

        if("speechiness" in data  && !(discovred_set.includes("speechiness"))){
          data_array.push(new TrackFeature('speechiness', data['speechiness']));
          discovred_set.push('speechiness');
        };
        if("valence" in data && !(discovred_set.includes("valence"))){
          data_array.push(new TrackFeature('valence', data['valence']));
          discovred_set.push('valence');
        };
        if("energy" in data && !(discovred_set.includes("energy"))){
          data_array.push(new TrackFeature('energy', data['energy']));
          discovred_set.push('energy');
        };
        if("acousticness" in data && !(discovred_set.includes("acousticness"))){
          data_array.push(new TrackFeature('acousticness', data['acousticness']));
          discovred_set.push('acousticness');
        };
        if("liveness" in data && !(discovred_set.includes("liveness"))){
          data_array.push(new TrackFeature('liveness', data['liveness']));
          discovred_set.push('liveness');
        };
      }
      console.log(data_array);
      return data_array;
    })
  }


}
