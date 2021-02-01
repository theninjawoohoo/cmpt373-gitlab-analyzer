import { Column, Entity, PrimaryColumn } from 'typeorm';

// user is a reserved word in postgres
@Entity('repository')
export class Repo {
  @PrimaryColumn()
  repo_id: number;

  @Column()
  repo_name: string;

  @Column()
  web_url: string;
  
  @Column()
  token: string;

  @Column('jsonb')
  repo_detail: object;
}
