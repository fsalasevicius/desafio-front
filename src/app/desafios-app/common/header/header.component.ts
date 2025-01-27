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
  constructor(private _router: Router, private _authService: AuthService) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
   }

  @Input() headerShadow: string | undefined;
  public token = localStorage.getItem('authToken');
  user: any = undefined;
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
    event.stopPropagation(); 
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

  handleSidebar() {
    this.showSidebar = true;
  }
  handleSidebarClose() {
    this.showSidebar = false;
  }

  homeDropdown() {
    this.showHomeDropdown = !this.showHomeDropdown
  }
  coursesDropdown() {
    this.showCoursesDropdown = !this.showCoursesDropdown
  }

  blogDropdown() {
    this.showBlogDropdown = !this.showBlogDropdown
  }
  UsrDropdown() {
    this.showUsrDropdown = !this.showUsrDropdown
  }
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
