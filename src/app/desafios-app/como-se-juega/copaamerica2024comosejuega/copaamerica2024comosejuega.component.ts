import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-copaamerica2024comosejuega',
  templateUrl: './copaamerica2024comosejuega.component.html',
  styleUrls: ['./copaamerica2024comosejuega.component.scss']
})
export class Copaamerica2024comosejuegaComponent implements OnInit {

  isSmallScreen$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
  }
}