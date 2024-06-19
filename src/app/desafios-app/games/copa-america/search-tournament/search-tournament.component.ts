import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-tournament',
  templateUrl: './search-tournament.component.html',
  styleUrls: ['./search-tournament.component.scss'],
})
export class SearchTournamentComponent implements OnInit {
  loading: boolean = false;
  private searchTerms = new Subject<string>();
  searchForm: FormGroup;
  joinForm: FormGroup;
  searchResult: any;
  user: any = undefined;
  selectedTournament: any;
  public token = localStorage.getItem('authToken');
  displayModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService,
    private _messageService: MessageService,
    private _router: Router
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
    this.searchForm = this.fb.group({
      tournamentName: ['', Validators.required],
    });

    this.joinForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300), // Espera 300ms después de cada pulsación de tecla
        distinctUntilChanged(), // Ignora si el término de búsqueda es el mismo que el anterior
        switchMap((term: string) => {
          this.loading = true; // Mostrar cargador cuando se inicia la búsqueda
          return this._copaAmericaService.searchTournament(
            { tournamentName: term, userEmail: this.user.email },
            this.token
          );
        })
      )
      .subscribe((response) => {
        this.searchResult = response.tournaments;
        this.loading = false; // Ocultar cargador cuando se completa la búsqueda
      });
  }

  searchTournament(): void {
    const formValue = this.searchForm.get('tournamentName');
    if (formValue) {
      const term = formValue.value;
      this.searchTerms.next(term);
      this.loading = true;
    }
  }

  selectTournament(tournament: any): void {
    this.selectedTournament = tournament;
    this.showDialog();
  }

  showDialog() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  joinTournament(): void {
    if (!this.selectedTournament) return;

    this.loading = true;
    const userData = JSON.parse(localStorage.getItem('userData')!);
    if (!userData || !userData.email) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario no encontrado en localStorage',
      });
      this.loading = false;
      return;
    }

    const userEmail = userData.email;
    const tournamentId = this.selectedTournament._id;
    const password = this.joinForm.get('password')!.value;

    if (!password) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La Contraseña es obligatoria.',
      });
      this.loading = false;
      return;
    }

    this._copaAmericaService
      .joinTournamentPass({ tournamentId, password, userEmail }, this.token)
      .subscribe(
        (response) => {
          if (response.success) {
            this._messageService.add({
              severity: 'success',
              summary: 'Te uniste al torneo con exito!',
              detail: response.message,
            });
            this.loading = false;
            this.closeModal();
            this._router.navigate(['/games-copa-america-view-tournament', tournamentId]);
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
            this.loading = false;
          }
        },
        (error) => {
          let errorMsg = 'Error al unirse al torneo';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          }
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
          });
          this.loading = false;
        }
      );
  }
}
