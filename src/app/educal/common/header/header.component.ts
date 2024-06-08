import { Component, HostListener, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderTwoComponent implements OnInit {
  constructor(private _router: Router, private _authService: AuthService) { }

  @Input() headerShadow: string | undefined;
  public buttonText: string = 'Ingresar';
  public userName: string | null = null;
  public isDropdownOpen: boolean = false;
  headerSticky: boolean = false;
  showSidebar: boolean = false;
  showHomeDropdown: boolean = false;
  showCoursesDropdown: boolean = false;
  showBlogDropdown: boolean = false;
  showUsrDropdown: boolean = false;
  showPagesDropdown: boolean = false;

  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 80) {
      this.headerSticky = true
    }
    else {
      this.headerSticky = false
    }
  }
  getEmail(): string | null {
    return localStorage.getItem('userName');
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Para evitar que el evento llegue al documento y cierre el dropdown
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  updateButtonText(): void {
    const token = this._authService.getToken();
    const currentRoute = this._router.url;
  
    if (token) {
      const userName = this._authService.getEmail();
      this.userName = userName !== null ? userName.toString() : 'Usuario';
    }
  
    if (currentRoute.includes('sign-in')) {
      this.buttonText = 'Registrarse';
    } else if (currentRoute.includes('sign-up')) {
      this.buttonText = 'Ingresar';
    } else {
      this.buttonText = token ? (this.userName ? this.userName.toString() : 'Usuario') : 'Ingresar';
    }
  }

  
  
  // handleSidebar
  handleSidebar() {
    this.showSidebar = true;
  }
  handleSidebarClose() {
    this.showSidebar = false;
  }

  // home dropdown
  homeDropdown() {
    this.showHomeDropdown = !this.showHomeDropdown
  }
  // coursesDropdown
  coursesDropdown() {
    this.showCoursesDropdown = !this.showCoursesDropdown
  }

  // blogDropdown
  blogDropdown() {
    this.showBlogDropdown = !this.showBlogDropdown
  }
  UsrDropdown() {
    this.showUsrDropdown = !this.showUsrDropdown
  }
  // pagesDropDown
  pagesDropDown() {
    this.showPagesDropdown = !this.showPagesDropdown
  }

  ngOnInit(): void {
    this.updateButtonText();
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateButtonText();
    });
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/sign-in']); 
  }

}
