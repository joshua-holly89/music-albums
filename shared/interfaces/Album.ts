export interface IAlbum {
    id: number;
    artist_name: string;
    album_title: string;
    release_date: string;
    genre: string;
    record_label: string;
    cover_base64?: string;
    rating?: number;
    number_of_ratings: number;
  }