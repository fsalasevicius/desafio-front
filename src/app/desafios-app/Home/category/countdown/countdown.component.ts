import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  private targetDate = new Date('2024-06-20T21:00:00-03:00'); // Fecha y hora objetivo (hora argentina)
  private subscription!: Subscription;

  public timeLeft!: string;

  ngOnInit(): void {
    this.updateTimeLeft();
    this.subscription = interval(1000).subscribe(() => this.updateTimeLeft());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateTimeLeft(): void {
    const now = new Date();
    const timeDifference = this.targetDate.getTime() - now.getTime();

    if (timeDifference <= 0) {
      this.timeLeft = '';
      this.subscription.unsubscribe();
    } else {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      this.timeLeft = `${days} d ${hours}h ${minutes}m ${seconds}s`;
    }
  }
}