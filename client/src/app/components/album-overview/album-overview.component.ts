import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { IAlbum } from '../../../../../shared/interfaces/Album';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Album, AlbumsService } from '../../../../api_client';
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlbumDetailComponent } from '../album-detail/album-detail.component';
import { EditCreateAlbumComponent } from '../edit-create-album/edit-create-album.component';

@Component({
  selector: 'app-album-overview',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './album-overview.component.html',
  styleUrl: './album-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumOverviewComponent implements OnDestroy {
  public albumsService = inject(AlbumsService);
  public albums$: Observable<IAlbum[]> = this.albumsService
    .albumControllerFindAll()
    .pipe(shareReplay(1));
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public rate(album: IAlbum, rating: number): void {
    album.rating = rating;
    this.albumsService
      .albumControllerRate(album.id, { rating })
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedAlbum: Album) => {
        this.updateAlbumLocally(updatedAlbum);
      });
  }

  public getEmptyOrFilledStar(album: IAlbum, numberOfStar: number): string {
    if (album.rating && album.rating >= numberOfStar) {
      return '★';
    } else {
      return '✰';
    }
  }

  public showDetails(album: IAlbum): void {
    this.dialog.open(AlbumDetailComponent, {
      data: {
        album: album,
      },
    });
  }

  public delete(album: IAlbum): void {
    this.albumsService
      .albumControllerRemove(album.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.removeAlbumLocally(album);
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  public edit(album: IAlbum): void {
    const dialogRef = this.dialog.open(EditCreateAlbumComponent, {
      data: {
        album: album,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedAlbum) => {
        if (updatedAlbum) {
          this.updateAlbumLocally(updatedAlbum);
        }
      });
  }

  public create(): void {
    const dialogRef = this.dialog.open(EditCreateAlbumComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((createdAlbum) => {
        this.createAlbumLocally(createdAlbum);
      });
  }

  public trackByAlbums(_index: number, album: IAlbum): number {
    return album.id;
  }

  private createAlbumLocally(createdAlbum: any): void {
    if (createdAlbum) {
      this.albums$ = this.albums$.pipe(
        map((albums) => [...albums, createdAlbum])
      );
      this.cd.detectChanges();
    }
  }

  private removeAlbumLocally(album: IAlbum): void {
    this.albums$ = this.albums$
      .pipe(takeUntil(this.destroy$))
      .pipe(map((albums) => albums.filter((a) => a.id !== album.id)));
      this.cd.detectChanges();

  }

  private updateAlbumLocally(updatedAlbum: Album): void {
    this.albums$ = this.albums$.pipe(
      map((albums) =>
        albums.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a))
      )
    );
    this.cd.detectChanges();

  }
}
