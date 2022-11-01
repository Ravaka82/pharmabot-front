import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MaterialIconComponent} from "./component/material-icon/material-icon.component";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgxColorsModule} from "ngx-colors";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatDividerModule} from "@angular/material/divider";
import {MatStepperModule} from "@angular/material/stepper";
import {MatChipsModule} from "@angular/material/chips";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AvatarModule} from "ngx-avatar";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import {InputEditableDirective} from './directive/input-editable.directive';
import {InputEditableComponent} from './component/input-editable/input-editable.component';
import {SearchComponent} from './component/search/search.component';
import {UnsubscribeComponent} from "./component/unsubscribe/unsubscribe.component";
import {NgwWowModule} from "ngx-wow";
import {PageTitleComponent} from './component/page-title/page-title.component';
import {ModalConfirmationComponent} from './component/modal-confirmation/modal-confirmation.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {LoadingModalComponent} from './component/loading-modal/loading-modal.component';
import {LottieModule} from "ngx-lottie";
import {RouterModule} from "@angular/router";
import { ModalSuccessComponent } from './component/modal-success/modal-success.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";

const Modules = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatTabsModule,
  MatSelectModule,
  FlexModule,
  FormsModule,
  NgxDatatableModule,
  NgxColorsModule,
  MatDividerModule,
  MatStepperModule,
  MatChipsModule,
  MatDatepickerModule,
  MatRippleModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  AvatarModule,
  MatListModule,
  MatDialogModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatBottomSheetModule,
  MatTooltipModule,
  MatMenuModule,
  ScrollingModule
]

@NgModule({
  declarations: [
    MaterialIconComponent,
    InputEditableDirective,
    InputEditableComponent,
    SearchComponent,
    UnsubscribeComponent,
    PageTitleComponent,
    ModalConfirmationComponent,
    LoadingModalComponent,
    ModalSuccessComponent
  ],
    imports: [
        CommonModule,
        NgwWowModule,
        ...Modules,
        MatProgressBarModule,
        LottieModule,
        RouterModule
    ],
  exports: [
    ...Modules,
    MaterialIconComponent,
    InputEditableDirective,
    InputEditableComponent,
    SearchComponent,
    UnsubscribeComponent,
    PageTitleComponent
  ],
  entryComponents: [ModalConfirmationComponent, ModalSuccessComponent],
  providers: [
    MatDatepickerModule, DatePipe]
})
export class SharedModule { }
