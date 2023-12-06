import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Repository } from 'typeorm';
import { getExampleAlbums } from './example_albums';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {
    this.initializeAlbums();
  }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  findOne(id: number): Promise<Album | null> {
    return this.albumRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.rating && album.rating > 3 && album.number_of_ratings >= 10) {
      throw new BadRequestException(
        'Cannot delete album with rating higher than 4 and 10 or more ratings',
      );
    }
    await this.albumRepository.delete(id);
  }

  async create(album: Album): Promise<Album> {
    album.number_of_ratings = album.number_of_ratings || 0;
    return await this.albumRepository.save(album);
  }

  async update(id: number, albumData: Partial<Album>): Promise<Album | null> {
    await this.albumRepository.update(id, albumData);
    return this.albumRepository.findOne({ where: { id } });
  }

  async rate(id: number, rating: number): Promise<Album | null> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (album == null) {
      throw new NotFoundException('Album not found');
    }
    album.rating = rating;
    album.number_of_ratings = (album.number_of_ratings || 0) + 1;
    await this.albumRepository.save(album);
    return album;
  }

  private async initializeAlbums(): Promise<void> {
    const count = await this.albumRepository.count();
    if (count === 0) {
      const albums = getExampleAlbums().map((album) =>
        this.albumRepository.create(album),
      );

      await this.albumRepository.save(albums);
    }
  }
}
