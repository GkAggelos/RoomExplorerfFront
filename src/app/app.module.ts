import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { HostService } from './service/host.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProfileComponent } from './profile/profile.component';
import { AllreadExistsValidatorDirective } from './validation/allread-exists-validator.directive';
import { HostComponent } from './host/host.component';
import { ResidenceComponent } from './residence/residence.component';
import { AuthenticateInterceptor } from './interceptor/authenticate.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdminComponent,
    SearchResultComponent,
    ProfileComponent,
    AllreadExistsValidatorDirective,
    HostComponent,
    ResidenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('access_token')
      }
    })
  ],
  providers: [HostService,
  {
    provide: HTTP_INTERCEPTORS, 
    useClass: AuthenticateInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
