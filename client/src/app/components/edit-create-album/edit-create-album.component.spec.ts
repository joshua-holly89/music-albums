import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditCreateAlbumComponent } from './edit-create-album.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditCreateAlbumComponent', () => {
  let component: EditCreateAlbumComponent;
  let fixture: ComponentFixture<EditCreateAlbumComponent>;
  let mockDialogRef = { close: jasmine.createSpy('close') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCreateAlbumComponent, HttpClientTestingModule, NoopAnimationsModule] ,
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreateAlbumComponent);
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

  it('should submit the form', () => {
    spyOn(component as any, 'sendUpdatedOrCreatedAlbum').and.callThrough();
    component.onSubmit();
    expect((component as any).sendUpdatedOrCreatedAlbum).toHaveBeenCalled();
  });
});
