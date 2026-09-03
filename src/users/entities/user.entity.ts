import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('linkedin_users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: true, length: 500 })
  full_name: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  linkedin_username: string;

  @Column({ nullable: true })
  linkedin_id: string;

  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  facebook_username: string;

  @Column({ nullable: true })
  facebook_id: string;

  @Index()
  @Column({ nullable: true, length: 500 })
  industry: string;

  @Index()
  @Column({ nullable: true, length: 500 })
  job_title: string;

  @Column({ nullable: true })
  job_title_role: string;

  @Column({ nullable: true })
  job_title_levels: string;

  @Column({ nullable: true })
  job_company_id: string;

  @Index()
  @Column({ nullable: true, length: 500 })
  job_company_name: string;

  @Column({ nullable: true })
  job_company_website: string;

  @Column({ nullable: true })
  job_company_size: string;

  @Column({ nullable: true })
  job_company_founded: string;

  @Column({ nullable: true })
  job_company_industry: string;

  @Column({ nullable: true })
  job_company_linkedin_url: string;

  @Column({ nullable: true })
  job_company_linkedin_id: string;

  @Column({ nullable: true })
  job_company_facebook_url: string;

  @Column({ nullable: true })
  job_company_twitter_url: string;

  @Column({ nullable: true })
  job_company_location_name: string;

  @Column({ nullable: true })
  job_company_location_locality: string;

  @Column({ nullable: true })
  job_company_location_metro: string;

  @Column({ nullable: true })
  job_company_location_region: string;

  @Column({ nullable: true })
  job_company_location_geo: string;

  @Column({ nullable: true })
  job_company_location_country: string;

  @Column({ nullable: true })
  job_company_location_continent: string;

  @Column({ nullable: true })
  job_last_updated: string;

  @Column({ nullable: true })
  job_start_date: string;

  @Index()
  @Column({ nullable: true, length: 500 })
  location_name: string;

  @Column({ nullable: true })
  location_locality: string;

  @Column({ nullable: true })
  location_metro: string;

  @Column({ nullable: true })
  location_region: string;

  @Column({ nullable: true })
  location_country: string;

  @Column({ nullable: true })
  location_continent: string;

  @Column({ nullable: true })
  location_geo: string;

  @Column({ nullable: true })
  location_last_updated: string;

  @Column({ nullable: true })
  linkedin_connections: string;

  @Column({ nullable: true })
  inferred_salary: string;

  @Column({ nullable: true })
  inferred_years_experience: string;

  @Column('text', { nullable: true })
  summary: string;

  @Column('text', { nullable: true })
  phone_numbers: string;

  @Column('text', { nullable: true })
  emails: string;

  @Column('text', { nullable: true })
  interests: string;

  @Column('text', { nullable: true })
  skills: string;

  @Column('text', { nullable: true })
  experience: string;

  @Column('text', { nullable: true })
  education: string;

  @Column('text', { nullable: true })
  profiles: string;

  @Column('text', { nullable: true })
  certifications: string;

  @Column('text', { nullable: true })
  languages: string;

  @Column({ nullable: true })
  version_status: string;

  @Column({ nullable: true })
  work_email: string;

  @Column({ nullable: true })
  job_company_location_street_address: string;

  @Column({ nullable: true })
  job_company_location_postal_code: string;

  @Column('text', { nullable: true })
  job_summary: string;

  @Column({ nullable: true })
  location_street_address: string;

  @Column({ nullable: true })
  location_postal_code: string;

  @Column({ nullable: true })
  middle_initial: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column({ nullable: true })
  birth_year: string;

  @Column({ nullable: true })
  birth_date: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  twitter_username: string;

  @Column({ nullable: true })
  github_url: string;

  @Column({ nullable: true })
  github_username: string;

  @Column({ nullable: true })
  mobile_phone: string;

  @Column({ nullable: true })
  location_address_line_2: string;

  @Column({ nullable: true })
  job_title_sub_role: string;

  @Column({ nullable: true })
  job_company_location_address_line_2: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
