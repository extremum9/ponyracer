import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';

describe('UserService', () => {
  let userService: UserService;
  let http: HttpTestingController;
  let localStorageGetItem: jasmine.Spy<(key: string) => string | null>;

  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => {
    localStorageGetItem = spyOn(Storage.prototype, 'getItem');
    localStorageGetItem.and.returnValue(null);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    userService = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterAll(() => http.verify());

  it('should authenticate and store a user', () => {
    spyOn(Storage.prototype, 'setItem');

    let actualUser: UserModel | undefined;
    userService.authenticate('cedric', 'hello').subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'POST', url: 'https://ponyracer.ninja-squad.com/api/users/authentication' });
    expect(req.request.body).toEqual({ login: 'cedric', password: 'hello' });
    req.flush(user);

    expect(actualUser).withContext('The observable should return the user').toBe(user);
    expect(userService.currentUser()).toEqual(user);

    TestBed.flushEffects();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(user));
  });

  it('should register a user', () => {
    let actualUser: UserModel | undefined;
    userService.register(user.login, 'password', 1986).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'POST', url: 'https://ponyracer.ninja-squad.com/api/users' });
    expect(req.request.body).toEqual({ login: user.login, password: 'password', birthYear: 1986 });
    req.flush(user);

    expect(actualUser).withContext('You should emit the user.').toBe(user);
  });

  it('should retrieve a user if one is stored', () => {
    localStorageGetItem.and.returnValue(JSON.stringify(user));

    userService.retrieveUser();

    expect(userService.currentUser()).toEqual(user);
    expect(localStorageGetItem).toHaveBeenCalledWith('rememberMe');
  });

  it('should retrieve no user if none stored', () => {
    userService.retrieveUser();

    expect(userService.currentUser()).toBeNull();
  });

  it('should logout the user', () => {
    spyOn(Storage.prototype, 'removeItem');
    localStorageGetItem.and.returnValue(JSON.stringify(user));
    userService.retrieveUser();
    expect(userService.currentUser()).toEqual(user);

    userService.logout();

    expect(userService.currentUser()).toBeNull();

    TestBed.flushEffects();
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('rememberMe');
  });
});
