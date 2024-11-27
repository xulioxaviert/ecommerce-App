import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../core/const/constants';
import { CategoryFake } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';
import { UserRandom } from '../../core/models/user-random.model';


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [ NgForOf, TranslateModule, TranslateModule ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  team: any[] = [];

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getUsersRandom).subscribe((users) => {
      this.team = users.body.results;
      console.log(users.body.results);
    });
  }
}