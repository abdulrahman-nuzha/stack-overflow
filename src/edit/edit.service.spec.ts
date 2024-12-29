import { Test, TestingModule } from '@nestjs/testing';
import { EditService } from './edit.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EditService', () => {
  let service: EditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditService,PrismaService],
    }).compile();

    service = module.get<EditService>(EditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
