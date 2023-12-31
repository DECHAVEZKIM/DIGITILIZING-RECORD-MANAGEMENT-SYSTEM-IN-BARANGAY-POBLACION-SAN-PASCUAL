import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AppRoutingModule } from '../app-routing.module';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { loadingReducer } from '../../store/Loading/loading.reducers';
import { loginReducer } from '../../store/login/login.reducers';
import { AppState } from '../../store/AppState';
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from '../../store/login/login.action';
import { AuthService } from 'src/services/auth/auth.service';
import { User } from '../model/user/User';
import { of } from 'rxjs';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let router: Router;
    let page;
    let store: Store<AppState>;
    let toastController: ToastController;
    let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
        IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        StoreModule.forRoot([]),
        StoreModule.forFeature("loading", loadingReducer),
        StoreModule.forFeature("login", loginReducer)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    toastController = TestBed.get(ToastController);
    authService = TestBed.get(AuthService);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
}));

  it('should create form on init', () => {
    component.ngOnInit();
    
    expect(component.form).not.toBeUndefined();
  })




  it('should go to register on register', () => {
  spyOn(router, 'navigate');

  component.register();

  expect(router.navigate).toHaveBeenCalledWith(['register']);
})

  it('should recover email/password on forgot email/password', () => {
    fixture.detectChanges();
    component.form.get('email')?.setValue("valid@email.com");
    page.querySelector("#recoverPasswordButton").click();
    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy();
    })
  })

  it('should show loading when recovering password', () => {

    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
  })

  it('should hide loading and show success message when has recovered password', () =>{
    spyOn(toastController, 'create').and.callThrough();

    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordSuccess());
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('should hide loading and show error message when error on recover password', () => {
    spyOn(toastController, 'create').and.callThrough();

    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordFail({error: "message"}));
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('should show loading and start login when logging in', () => {
    fixture.detectChanges();
    component.form.get('email').setValue('valid@email.com');
    component.form.get('password').setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
    store.select('login').subscribe(loginState => {
      expect(loginState.isLoggingIn).toBeTruthy();
    })
  })

  it('should hide loading and send user to home page when user has logged in', () => {
    spyOn(router, 'navigate').and.callThrough();
    spyOn(authService, 'login').and.returnValue(of(new User()));

    fixture.detectChanges();
    component.form.get('email').setValue('valid@email.com');
    component.form.get('password').setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    store.select('login').subscribe(loginState =>{
      expect(loginState.isLoggedIn).toBeTruthy();
    })
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/home']);
  })
});