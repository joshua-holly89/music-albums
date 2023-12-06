import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumDetailComponent } from './album-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let mockDialogRef = { close: jasmine.createSpy('close') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            album: {
              id: 7,
              artist_name: 'Aurora Borealis',
              album_title: 'Northern Lights',
              release_date: '2024-01-01',
              genre: 'Ambient',
              record_label: 'Ethereal Soundscapes',
              cover_base64: null,
              rating: null,
              number_of_ratings: 0,
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
