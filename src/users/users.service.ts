import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SearchUserDto, PaginatedResult } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async search(query: SearchUserDto): Promise<PaginatedResult<UserEntity>> {
    const { keyword, industry, skill, job_title, company, location, page = 1, limit = 10 } = query;

    const qb = this.userRepository.createQueryBuilder('u');

    // Keyword search across multiple fields
    if (keyword) {
      const kw = `%${keyword}%`;
      qb.andWhere(
        `(
          u.full_name LIKE :kw OR
          u.job_title LIKE :kw OR
          u.job_company_name LIKE :kw OR
          u.industry LIKE :kw OR
          u.skills LIKE :kw OR
          u.summary LIKE :kw OR
          u.location_name LIKE :kw OR
          u.first_name LIKE :kw OR
          u.last_name LIKE :kw
        )`,
        { kw },
      );
    }

    // Filter by skill
    if (skill) {
      qb.andWhere('u.skills LIKE :skill', { skill: `%${skill}%` });
    }

    // Filter by industry
    if (industry) {
      qb.andWhere('u.industry LIKE :industry', { industry: `%${industry}%` });
    }

    // Filter by job title
    if (job_title) {
      qb.andWhere('u.job_title LIKE :job_title', { job_title: `%${job_title}%` });
    }

    // Filter by company
    if (company) {
      qb.andWhere('u.job_company_name LIKE :company', { company: `%${company}%` });
    }

    // Filter by location
    if (location) {
      qb.andWhere('u.location_name LIKE :location', { location: `%${location}%` });
    }

    // Count total items
    const totalItems = await qb.getCount();

    // Apply pagination and get results
    const data = await qb
      .orderBy(
        keyword
          ? `CASE
              WHEN u.full_name LIKE :kw THEN 1
              WHEN u.job_title LIKE :kw THEN 2
              WHEN u.job_company_name LIKE :kw THEN 3
              ELSE 4
            END`
          : 'u.created_at',
        'ASC',
      )
      .setParameters(keyword ? { kw: `%${keyword}%` } : {})
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async getStatistics(): Promise<any> {
    const totalUsers = await this.userRepository.count();

    const industries = (await this.userRepository
      .createQueryBuilder('u')
      .select('u.industry', 'industry')
      .addSelect('COUNT(*)', 'count')
      .where("u.industry IS NOT NULL AND u.industry != ''")
      .andWhere("u.industry NOT LIKE '[%'")
      .groupBy('u.industry')
      .orderBy('count', 'DESC')
      .getRawMany()) as { industry: string; count: string }[];

    const validIndustries = industries.filter(
      (r) => !r.industry.trim().startsWith('['),
    );

    const countries = await this.userRepository
      .createQueryBuilder('u')
      .select('u.location_country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where("u.location_country IS NOT NULL AND u.location_country != ''")
      .groupBy('u.location_country')
      .orderBy('count', 'DESC')
      .getRawMany();

    const companies = await this.userRepository
      .createQueryBuilder('u')
      .select('u.job_company_name', 'company')
      .addSelect('COUNT(*)', 'count')
      .where("u.job_company_name IS NOT NULL AND u.job_company_name != ''")
      .groupBy('u.job_company_name')
      .orderBy('count', 'DESC')
      .limit(15)
      .getRawMany();

    const salaryRanges = await this.userRepository
      .createQueryBuilder('u')
      .select('u.inferred_salary', 'range')
      .addSelect('COUNT(*)', 'count')
      .where("u.inferred_salary IS NOT NULL AND u.inferred_salary != ''")
      .groupBy('u.inferred_salary')
      .orderBy('count', 'DESC')
      .getRawMany();

    const genderDist = await this.userRepository
      .createQueryBuilder('u')
      .select('u.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.gender')
      .getRawMany();

    return {
      totalUsers,
      industries: validIndustries.map((r) => ({ industry: r.industry, count: parseInt(r.count, 10) })),
      countries: countries.map((r) => ({ country: r.country, count: parseInt(r.count, 10) })),
      topCompanies: companies.map((r) => ({ company: r.company, count: parseInt(r.count, 10) })),
      salaryRanges: salaryRanges.map((r) => ({ range: r.range, count: parseInt(r.count, 10) })),
      genderDistribution: genderDist.map((r) => ({ gender: r.gender, count: parseInt(r.count, 10) })),
    };
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
