import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumOverviewComponent } from './album-overview.component';
import { AlbumsService } from '../../../../api_client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

const albumRatedWith5 = {
  id: 9,
  artist_name: 'Melodic Minds',
  album_title: 'Harmonic Horizons',
  release_date: '2023-08-20',
  genre: 'Jazz Fusion',
  record_label: 'Smooth Grooves',
  cover_base64: "",
  rating: 5,
  number_of_ratings: 0,
};
const albumRatedWith3 = {
  id: 9,
  artist_name: 'Melodic Minds',
  album_title: 'Harmonic Horizons',
  release_date: '2023-08-20',
  genre: 'Jazz Fusion',
  record_label: 'Smooth Grooves',
  cover_base64: "",
  rating: 3,
  number_of_ratings: 0,
};
describe('AlbumOverviewComponent', () => {
  let component: AlbumOverviewComponent;
  let albumsService: AlbumsService;
  let fixture: ComponentFixture<AlbumOverviewComponent>;
  let mockDialogRef = {
    close: jasmine.createSpy('close'),
    afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of({}))
  };
  let mockDialog = {
    open: jasmine.createSpy('open').and.returnValue(mockDialogRef),
  };
  let mockAlbumsService = {
    albumControllerRemove: jasmine
      .createSpy('albumControllerRemove')
      .and.returnValue(of({})),
    albumControllerFindAll: jasmine
      .createSpy('albumControllerFindAll')
      .and.returnValue(of([])),
      albumControllerRate: jasmine
      .createSpy('albumControllerFindAll')
      .and.returnValue(of({ id: 1, rating: 5 })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumOverviewComponent],
      providers: [AlbumsService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: AlbumsService, useValue: mockAlbumsService },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumOverviewComponent);
    albumsService = TestBed.inject(AlbumsService);
    // httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should rate an album', () => {
    const album = { id: 1, rating: 3 };
    const newRating = 5;
    const mockResponse = { ...album, rating: newRating };

    albumsService.albumControllerRate(album.id, { rating: newRating }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });

  it('should return filled star when rating is greater than or equal to index', () => {
    expect(component.getEmptyOrFilledStar( albumRatedWith5, 4)).toBe('★');
  });

  it('should return empty star when rating is less than index', () => {
    expect(component.getEmptyOrFilledStar(albumRatedWith3, 4)).toBe('✰');
  });

  it('should open the dialog', () => {
    const album = { id: 1, artist_name: 'Artist', album_title: 'Album', release_date: '2022-01-01', genre: 'Genre', record_label: 'Label', cover_base64: 'Cover', rating: 5, number_of_ratings: 1 };
    component.showDetails(album);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should delete the album', () => {
    spyOn(component as any, 'removeAlbumLocally');
    const album = { id: 1, artist_name: 'Artist', album_title: 'Album', release_date: '2022-01-01', genre: 'Genre', record_label: 'Label', cover_base64: 'Cover', rating: 5, number_of_ratings: 1 };
    component.delete(album);
    expect(mockAlbumsService.albumControllerRemove).toHaveBeenCalledWith(album.id);
    expect((component as any).removeAlbumLocally).toHaveBeenCalledWith(album);
  });

  it('should open the dialog and update the album locally', () => {
    spyOn(component as any, 'updateAlbumLocally');
    const album = { id: 1, artist_name: 'Artist', album_title: 'Album', release_date: '2022-01-01', genre: 'Genre', record_label: 'Label', cover_base64: 'Cover', rating: 5, number_of_ratings: 1 };
    component.edit(album);
    expect(mockDialog.open).toHaveBeenCalled();
    expect((component as any).updateAlbumLocally).toHaveBeenCalledWith({});
  });

  it('should delete the album', () => {
    spyOn(component as any, 'removeAlbumLocally');
    const album = { id: 1, artist_name: 'Artist', album_title: 'Album', release_date: '2022-01-01', genre: 'Genre', record_label: 'Label', cover_base64: 'Cover', rating: 5, number_of_ratings: 1 };
    component.delete(album);
    expect(mockAlbumsService.albumControllerRemove).toHaveBeenCalledWith(album.id);
    expect((component as any).removeAlbumLocally).toHaveBeenCalledWith(album);
  });
});
