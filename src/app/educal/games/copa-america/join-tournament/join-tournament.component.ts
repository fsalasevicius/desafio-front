import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-join-tournament',
  templateUrl: './join-tournament.component.html',
  styleUrls: ['./join-tournament.component.scss']
})
export class JoinTournamentComponent implements OnInit { 
  joinForm!: FormGroup;
  user: any = undefined;
  public token = localStorage.getItem('authToken');

  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
   }

  ngOnInit(): void {
    this.joinForm = this.fb.group({
      tournamentName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.joinForm.invalid) {
      return;
    }

    const { tournamentName, password } = this.joinForm.value;
    const userEmail = this.user.email;
    this._copaAmericaService.joinTournament({ tournamentName, userEmail, password }, this.token).subscribe(
      (response) => {
        console.log('Unido al torneo con éxito:', response);
      },
      (error) => {
        console.error('Error al unirse al torneo:', error);
      }
    );
  }
}