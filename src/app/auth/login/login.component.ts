import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {AccountActions} from "../../@core/store/actions";
import {AccountSelector} from "../../@core/store/selectors";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnInit {

  showPassword: boolean = false;
  errorMessage: string = '';
  inputForm: FormGroup = {} as FormGroup;
  loading = false;
  submitting = false;
  MESSAGE_TEXT = {
    "FIELD_REQUIRED": '⚠️ Ce champ ne doit pas être vide.'
  }

  constructor( protected store: Store) {
  }

  ngAfterViewInit(): void {
    this.inputForm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe(() => {
      if (this.inputForm.valid) {
        this.errorMessage = '';
      }
    })
  }

  ngOnInit(): void {

    this.inputForm = new FormGroup({
      pseudo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    this.store.pipe(
      select(AccountSelector.selectState)
    ).subscribe(({loading, errorMessage}) => {
      this.loading = loading;
      if (!loading && this.submitting) {
        if (errorMessage) {
          this.errorMessage = `⚠️ ${errorMessage}`
          this.inputForm.enable();
          this.inputForm.controls.password.reset();
        }
        this.submitting = false;
      }
    })
  }

  login() {
    this.errorMessage = '';
    this.inputForm.disable();
    this.submitting = true;
    this.store.dispatch(AccountActions.LOGIN_REQUESTED({
      input: this.inputForm.value
    }))
  }

}
