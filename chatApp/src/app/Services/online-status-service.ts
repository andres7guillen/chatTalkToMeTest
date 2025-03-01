import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseRealTimeService } from './firebase-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService implements OnDestroy {
  public userName:string = '';
  private isOnlineSubject = new BehaviorSubject<boolean>(true);
  isOnline$ = this.isOnlineSubject.asObservable();

  constructor(private realTimeService: FirebaseRealTimeService) 
  { 
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleWindowClose);
  }

  private handleVisibilityChange = () => {
    this.disconnect();
    if (document.hidden) {
      console.log('❌ Aplicación minimizada o pestaña en segundo plano');
      this.isOnlineSubject.next(false);
    } else {
      console.log('✅ Aplicación activa nuevamente');
      this.isOnlineSubject.next(true);
      this.reconnect();
    }
  };

  private handleWindowClose = () => {
    this.disconnect();
  };

  private disconnect() {
    this.userName = localStorage.getItem('userName') || '';
    if (this.userName) {
      this.realTimeService.disconnectUser(this.userName);
    }
  }

  private reconnect() {
    this.userName = localStorage.getItem('userName') || '';
    if (this.userName) {
      this.realTimeService.connectUser(this.userName);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

}
