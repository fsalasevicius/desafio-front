import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-friends-tournament',
  templateUrl: './friends-tournament.component.html',
  styleUrls: ['./friends-tournament.component.scss'],
})
export class FriendsTournamentComponent implements OnInit {
  tournamentForm!: FormGroup;
  tournamentLink: string | null = null;
  public torneoDetail: any;
  public password: any;
  public selectedTournament: string | null = null;
  user: any = undefined;
  public token = localStorage.getItem('authToken');
  public owner = localStorage.getItem('userName');
  whatsappLinks: string[] = [];
  i: number = 0;
  emailFormControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService,
    private _messageService: MessageService
  ) {
    this.tournamentForm = this.fb.group({
      tournamentName: ['', Validators.required],
      tournamentDetail: ['', Validators.required],
      friendsEmails: this.fb.array([this.createFriendEmail()]), 
    });
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
  }

  ngOnInit(): void {
    this._copaAmericaService.tournament_detail().subscribe((response) => {
      this.torneoDetail = response.data;
    });
    this.tournamentForm = this.fb.group({
      tournamentName: ['', Validators.required],
      tournamentDetail: ['', Validators.required],
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

    const { tournamentName, tournamentDetail, friendsEmails } =
      this.tournamentForm.value;
    const emails = this.friendsEmails.controls.map(
      (control: AbstractControl) => control.value.email
    );
    const tournamentId = this.generateTournamentId();
    const password = this.generatePassword();
    const ownerId = this.user._id;

    const friendsEmailsControl = this.tournamentForm.get('friendsEmails');
    if (friendsEmailsControl) {
      const formData = {
        tournamentName: this.tournamentForm.value.tournamentName,
        tournamentDetail: this.tournamentForm.value.tournamentDetail,
        friendsEmails: friendsEmailsControl.value.map(
          (emailControl: any) => emailControl.email
        ),
        password,
        owner: ownerId,
      };
      this._copaAmericaService.createTournament(formData, this.token).subscribe(
        (response) => {
          let nameTournament = formData.tournamentName;
          this.tournamentLink = `${window.location.origin}/games-copa-america-join-tournament`;
          let password = response.password;
          this.sendInvitationEmails(emails, nameTournament, password);
          this.generateWhatsAppLinks(emails, nameTournament);
      
          if (response && response.password) {
            this._messageService.add({
              severity: 'success',
              summary: 'Proceso Exitoso!',
              detail: 'Creando Torneo',
            });
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error al crear el torneo',
              detail: 'El nombre del torneo ya está en uso. Por favor, elige otro nombre.',
            });
          }
        },
        (error) => {
          if (error.status === 400 && error.error && error.error.message) {
            this._messageService.add({
              severity: 'error',
              summary: 'Error al crear el torneo',
              detail: error.error.message,
            });
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error al crear el torneo',
              detail: 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.',
            });
          }
        }
      );
    }
  }

  sendInvitationEmails(
    emails: string[],
    nameTournament: string,
    password: any
  ): void {
    let owner = this.owner;
    emails.forEach((email) => {
      this._copaAmericaService
        .sendInvitationEmail(
          { email, nameTournament, owner, password },
          this.token
        )
        .subscribe(
          (response) => {
          },
          (error) => {
            console.error('Error al enviar el correo:', error);
          }
        );
    });
  }

  generateWhatsAppLinks(emails: string[], tournamentName: string): void {
    this.whatsappLinks = emails.map((email) => {
      const invitationToken = this.generateInvitationToken();
      const baseUrl = window.location.origin;
      const message = `¡Te invito a unirte al torneo ${tournamentName}!\nCrea tu cuenta e ingresa al siguiente enlace para comenzar a jugar:\n\n${baseUrl}/games-copa-america-join-tournament?token=${invitationToken}`;
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/?text=${encodedMessage}`;
    });
  }

  generateTournamentId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generatePassword(): string {
    return Math.random().toString(36).substr(2, 8);
  }

  generateInvitationToken(): string {
    return Math.random().toString(36).substr(2, 20);
  }
}
