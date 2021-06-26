import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen'
// Просмотрел 258 видео
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      SplashScreen.hide();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth')
  }
}
