import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AppRoutingModule } from "../app-routing.module";
import { RegisterPage } from "./register.page";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterPageModule } from "./register.module";

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [ 
        IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        RegisterPageModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    router = TestBed.get(Router);

    component = fixture.componentInstance;
}));

});
