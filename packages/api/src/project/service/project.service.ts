import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from '../entities/project.entity';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectService{

  constructor(private http: HttpService, 
    @InjectRepository(Repo)
    private readonly projectRepository: Repository<Repo>,
  ){}

  async createProject(token: string) {
    var projects = this.http.get('http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4/projects?private_token='+token).pipe( map(response => response.data) );
    console.log(projects);
    await projects.forEach(project => {
      var repo = this.projectRepository.create({
        repo_id: project.id,
        repo_name: project.name,
        web_url: project.web_url,
        token: token,
        repo_detail: project,
      });
      this.projectRepository.save(repo);
    });
  }
    
  async getAllProjects(token: string){
    return this.projectRepository.find({
      where: { token: token }
    });
  }

  getProjectById(id: number){
    return this.projectRepository.findOne({
      where: { repo_id: id },
    });
  }
}