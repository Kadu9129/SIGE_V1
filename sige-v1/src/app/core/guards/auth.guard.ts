import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

export const authGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);
  const logger = inject(LoggerService);

	if (authService.isLoggedIn()) {
		const user = authService.getCurrentUser();
		logger.log('authGuard allow', { user });
		return true;
	}

  logger.warn('authGuard redirect to login');
	router.navigate(['/login']);
	return false;
};
