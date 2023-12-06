import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IAlbum } from '../../../../../shared/interfaces/Album';
import { AlbumDetailComponent } from '../album-detail/album-detail.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Album, AlbumsService } from '../../../../api_client';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-create-album',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './edit-create-album.component.html',
  styleUrl: './edit-create-album.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCreateAlbumComponent implements OnInit, OnDestroy {
  public album: Partial<IAlbum> = this.initializeAlbum();
  public albumForm: FormGroup | undefined;
  public mode: "edit" | "create" | undefined;
  private destroy$ = new Subject<void>();
  private readonly handlersOnSubscribe = {
    next: (updatedAlbum: Album) => {
      this.dialogRef.close(updatedAlbum);
    },
    error: () => {
      alert('Something went wrong!');
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {album: Partial<IAlbum>},
    public dialogRef: MatDialogRef<AlbumDetailComponent>,
    private formbuilder: FormBuilder,
    private albumsService: AlbumsService
  ) {}

  public ngOnInit(): void {
    this.albumForm = this.createAlbumForm()
    this.albumForm.patchValue(this.album);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onSubmit(): void {
    if (this.albumForm?.valid) {
      const updatedAlbum: IAlbum = { ...this.album, ...this.albumForm.value };
      delete updatedAlbum.cover_base64;
      this.sendUpdatedOrCreatedAlbum(updatedAlbum);
    }
  }

  private sendUpdatedOrCreatedAlbum(updatedAlbum: IAlbum): void {
    if(updatedAlbum.id == null) {
      this.albumsService
        .albumControllerCreate(updatedAlbum as Album)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.handlersOnSubscribe);
    } else {
      this.albumsService
      .albumControllerUpdate(updatedAlbum.id, updatedAlbum as Album)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.handlersOnSubscribe);
    }
  }

  private initializeAlbum(): Partial<IAlbum> {
    if (this.data?.album != null) {
      this.mode = "edit";
      return this.data.album;
    } else {
      this.mode = "create";
      return this.createEmptyAlbum();
    }
  }

  private createEmptyAlbum(): Partial<IAlbum> {
    return  {
      artist_name: '',
      album_title: '',
      release_date: '',
      genre: '',
      record_label: '',
      cover_base64: '',
      number_of_ratings: 0
    };
  }

  private createAlbumForm(): FormGroup {
    return this.formbuilder.group({
      artist_name: ['', Validators.required],
      album_title: ['', Validators.required],
      release_date: [''],
      genre: [''],
      record_label: [''],
    });
  }
}
