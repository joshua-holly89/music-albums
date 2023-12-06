import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IAlbum } from '../../../../shared/interfaces/Album';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Album implements IAlbum {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 500 })
  @ApiProperty()
  artist_name: string;

  @Column({ length: 500 })
  @ApiProperty()
  album_title: string;

  @Column('text')
  @ApiProperty()
  release_date: string;

  @Column({ length: 500 })
  @ApiProperty()
  genre: string;

  @Column({ length: 500 })
  @ApiProperty()
  record_label: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty()
  cover_base64?: string;

  @Column({ nullable: true })
  @ApiProperty()
  rating?: number;

  @Column()
  @ApiProperty()
  number_of_ratings: number;
}
