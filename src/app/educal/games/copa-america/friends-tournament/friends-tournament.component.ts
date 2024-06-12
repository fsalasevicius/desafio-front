import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-friends-tournament',
  templateUrl: './friends-tournament.component.html',
  styleUrls: ['./friends-tournament.component.scss']
})
export class FriendsTournamentComponent implements OnInit {
  tournamentForm!: FormGroup;
  tournamentLink: string | null = null;
  user: any = undefined;
  public token = localStorage.getItem('authToken');
  i: number = 0;
  emailFormControl = new FormControl();
  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService,
  ) {
    this.tournamentForm = this.fb.group({
      tournamentName: ['', Validators.required],
      friendsEmails: this.fb.array([this.createFriendEmail()]), // Initialize with one email field
    });
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
  }

  ngOnInit(): void {
    this.tournamentForm = this.fb.group({
      tournamentName: ['', Validators.required],
      friendsEmails: this.fb.array([]),
    });
  }

  createFriendEmail(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get friendsEmails(): FormArray {
    return this.tournamentForm.get('friendsEmails') as FormArray;
  }


  addFriendEmail(): void {
    this.friendsEmails.push(this.createFriendEmail());
  }

  removeEmail(index: number): void {
    this.friendsEmails.removeAt(index);
  }

  onSubmit(): void {
    if (this.tournamentForm.invalid) {
      return;
    }
  
    const { tournamentName, friendsEmails } = this.tournamentForm.value;
    console.log(this.tournamentForm.value)
    const emails = this.friendsEmails.controls.map((control: AbstractControl) => control.value.email);
    const tournamentId = this.generateTournamentId();
    const password = this.generatePassword();
    const ownerId = this.user._id;
  
    const friendsEmailsControl = this.tournamentForm.get('friendsEmails');
    if (friendsEmailsControl) {
      const formData = {
        tournamentName: this.tournamentForm.value.tournamentName,
        friendsEmails: friendsEmailsControl.value.map((emailControl: any) => emailControl.email),
        password,
        owner: ownerId,
      };
      this._copaAmericaService.createTournament(formData, this.token).subscribe(
        (response) => {
          console.log(formData)
          this.tournamentLink = `${window.location.origin}/games-copa-america-join-tournament/${tournamentId}`;
          this.sendInvitationEmails(emails, tournamentId, password);
        },
        (error) => {
          console.error('Error al crear el torneo:', error);
        }
      );
    }
  

    
  }

  sendInvitationEmails(emails: string[], tournamentId: string, password: string): void {
    emails.forEach(email => {
      this._copaAmericaService.sendInvitationEmail({ email, tournamentId, password }, this.token).subscribe(
        (response) => {
          console.log('Correo enviado a:', email);
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
        }
      );
    });
  }

  generateTournamentId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generatePassword(): string {
    return Math.random().toString(36).substr(2, 8);
  }
}