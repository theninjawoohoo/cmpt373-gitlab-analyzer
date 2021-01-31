import { Injectable, HttpService, HttpModule } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from '../entities/project.entity';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectService{

    constructor(private http: HttpService){

    }
    
    getAllProjects(token){
        return this.http.get('http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4/projects?private_token='+token)
            .pipe( map(response => response.data) );
    }

    getProjectById(id, token){
        return this.http.get('http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4/projects/'+id+'?private_token='+token)
            .pipe( map( response=> response.data));
    }
}