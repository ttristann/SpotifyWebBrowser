import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistData } from '../../data/artist-data';
import { AlbumData } from '../../data/album-data';
import { TrackData } from '../../data/track-data';
import { ResourceData } from '../../data/resource-data';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SpotifyService ]
})
export class SearchComponent implements OnInit {
  searchString:string;
  searchCategory:string = 'artist';
  searchCategories:string[] = ['artist', 'album', 'track'];
  resources:ResourceData[];

  constructor(private spotifyService:SpotifyService) { }

  ngOnInit() {
  }

  search() {
    console.log(this.searchString);
    console.log(this.searchCategory);
    this.spotifyService.searchFor(this.searchCategory, this.searchString).then(resp =>{
      (

        this.resources = resp,
        console.log(this.resources)
      )
    

    } )

    this.spotifyService.getTopTracksForArtist("06HL4z0CvFAxyc27GXpf02").then((data) => {
      console.log("this is data", data);
    })
  }

}
