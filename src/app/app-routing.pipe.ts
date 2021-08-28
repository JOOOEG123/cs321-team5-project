import { redirectUnauthorizedTo, customClaims } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

// Auth Guard Pipe function
export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

export const redirectLoggedInToHomepage = () =>
  map((user) => (user ? ['loggedIn', 'homepage', (user as any).uid] : true));

export const onlyAllowSeft = (next: { params: { id: any } }) =>
  map((user) => (!!user && next.params.id === (user as any).uid) || ['']);

export const onlyAllowById = () =>
  map((user) => (!!user ? ['loggedIn', 'homepage', (user as any).uid] : ['']));

export const onlyAllowAdmin = () =>
  pipe(
    customClaims,
    map((claims) => claims.admin === true || [''])
  );

export const redirectLoggedInToByRoutes = () =>
  pipe(
    customClaims,
    map((claims) => {
      // if no claims, then there is no auth user else alloe the toute [''].
      if (claims.length === 0) {
        return true;
      }
      // if a custom claim is set, then redirect to ['users'].
      if (claims.admin) {
        return ['loggedIn', 'view-users'];
      }
      // otherwise, redirecr user's profile page
      return ['loggedIn', 'profile', claims.user_id];
    })
  );

//only admin and main user can view page
export const allowOnlySelfOrAdmin = (next: { params: { id: any } }) =>
  pipe(
    customClaims,
    map((claims) => {
      // if no claims, then there is no auth user else alloe the toute [''].
      if (claims.length === 0) {
        return [''];
      }
      return next.params.id === claims.user_id || claims.admin;
    })
  );
