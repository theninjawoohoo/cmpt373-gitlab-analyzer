import { Column, Entity, PrimaryColumn } from 'typeorm';

// user is a reserved word in postgres
@Entity('repository')
export class Repo {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  web_url: string;
  
  @Column()
  token: string;

  @Column()
  json: string;
}
