import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription;
  timeLeft: number = 10;  // Inicializa con el valor deseado

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    this.subscription = interval(1000).subscribe(() => {
      this.updateTimeLeft();
    });
  }

  updateTimeLeft(): void {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.timeLeft = 0;  // Asegúrate de que se mantenga en 0
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}