import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './service/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}


  @UseGuards(JwtAuthGuard)
  @Get('/getProject')
  getProject(@Req() req) {  
    const request = require('request');
    var token='2P52x1JLbMvoSHSpr5gE';
    var username='wens';

    // let array=[];
    // https://github.com/request/request
    request(`http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4/users/${username}/projects?private_token=${token}`, {json: true}, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML 
    });
    }
}

