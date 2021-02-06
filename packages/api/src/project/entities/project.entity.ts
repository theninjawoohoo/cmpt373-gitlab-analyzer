import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('repository')
export class Repository_Entity {
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
