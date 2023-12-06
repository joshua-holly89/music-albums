import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AlbumService', () => {
  let service: AlbumService;
  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(3),
    findOne: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        { provide: getRepositoryToken(Album), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    jest
      .spyOn(service as any, 'initializeAlbums')
      .mockImplementation(() => Promise.resolve());
  });

  it('should return all albums', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return one album', async () => {
    const id = 1;
    const result = await service.findOne(id);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual({});
  });

  it('should delete the album', async () => {
    const id = 1;
    await service.remove(id);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(mockRepository.delete).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when album does not exist', async () => {
    mockRepository.findOne.mockResolvedValue(undefined);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when album rating is higher than 3 and number of ratings is 10 or more', async () => {
    mockRepository.findOne.mockResolvedValue({
      rating: 4,
      number_of_ratings: 10,
    });
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should create an album', async () => {
    const album = new Album();
    const result = await service.create(album);
    expect(mockRepository.save).toHaveBeenCalledWith(album);
    expect(result).toEqual({});
  });

  it('should update an album', async () => {
    const id = 1;
    const albumData = { album_title: 'New Title' };
    mockRepository.findOne.mockResolvedValue({
      number_of_ratings: 10,
      rating: 4,
    });
    const result = await service.update(id, albumData);
    expect(mockRepository.update).toHaveBeenCalledWith(id, albumData);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual({ number_of_ratings: 10, rating: 4 });
  });

  it('should rate an album', async () => {
    const id = 1;
    const rating = 5;
    mockRepository.findOne.mockResolvedValue({
      number_of_ratings: 10,
      rating: 4,
    });
    const result = await service.rate(id, rating);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual({ number_of_ratings: 11, rating: 5 });
  });
});
