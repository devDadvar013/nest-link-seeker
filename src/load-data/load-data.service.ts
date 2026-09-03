import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class LoadDataService {
  private readonly logger = new Logger(LoadDataService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async loadFromCsv(csvPath?: string): Promise<{ loaded: number; errors: number }> {
    const file = csvPath || path.join(__dirname, '../../data/linkedin_users.csv');

    // Skip loading if data already exists (runs on every startup, so without
    // this check every restart would duplicate all rows in the database)
    const existing = await this.userRepository.count();
    if (existing > 0) {
      this.logger.log(`Database already has ${existing} users — skipping CSV load`);
      return { loaded: 0, errors: 0 };
    }

    this.logger.log(`Loading data from: ${file}`);

    if (!fs.existsSync(file)) {
      this.logger.error(`CSV file not found: ${file}`);
      return { loaded: 0, errors: 0 };
    }

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').filter((l) => l.trim());

    if (lines.length < 2) {
      this.logger.error('CSV file is empty or has no data rows');
      return { loaded: 0, errors: 0 };
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const users = [];
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCsvLine(lines[i]);
        if (values.length !== headers.length) {
          errors++;
          continue;
        }

        const user = {} as any;
        headers.forEach((header, idx) => {
          user[header] = values[idx] || null;
        });

        // Indexed columns are varchar(500) in Postgres — truncate oversized
        // (often misaligned-CSV garbage) values so inserts and btree indexes work
        for (const col of ['full_name', 'industry', 'job_title', 'job_company_name', 'location_name']) {
          if (typeof user[col] === 'string' && user[col].length > 500) {
            user[col] = user[col].slice(0, 500);
          }
        }

        users.push(user);
      } catch (e) {
        errors++;
      }
    }

    // Insert all users at once
    const entities: any[] = [];
    for (const u of users) {
      entities.push(this.userRepository.create(u));
    }
    await this.userRepository.save(entities as any);

    this.logger.log(`Successfully loaded ${users.length} users into database`);
    return { loaded: users.length, errors };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }
}
