import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  showSpinner = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSpinner = false;
    }, 3000); 
  }
}
