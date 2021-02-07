import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryController } from './repository.controller';

describe('RepositoryController', () => {
  let controller: RepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoryController],
    }).compile();

    controller = module.get<RepositoryController>(RepositoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
