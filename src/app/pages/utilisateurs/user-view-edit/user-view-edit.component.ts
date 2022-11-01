import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {select, Store} from "@ngrx/store";
import {CatalogueGroupeSelector, RoleSelector, UserSelector} from "../../../@core/store/selectors";
import {filter, takeUntil} from "rxjs/operators";
import {combineLatest} from "rxjs";
import {CatalogueGroupe, Role, User} from "../../../@core/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserActions} from "../../../@core/store/actions";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-client-view-edit',
  templateUrl: './user-view-edit.component.html',
  styleUrls: ['./user-view-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserViewEditComponent extends UnsubscribeComponent implements OnInit {

  roles: Role.Entry[] = [];
  catalogueGroupes: CatalogueGroupe.Entry[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  isUpdate = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  userForm: FormGroup = {} as FormGroup;
  options: AnimationOptions = {
    path: '/assets/lotties/add-user.json',
    loop: false
  };

  constructor(protected store: Store, @Inject(MAT_DIALOG_DATA) private data: User.UserPage, private modalRef: MatDialogRef<any>) {
    super();
  }

  initForm(): void {
    this.userForm = new FormGroup({
      pseudo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      catalogueGroupe: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

   this.initForm();

    if (this.data) {
      this.isUpdate = true;
      this.userForm.patchValue({
        pseudo: this.data.pseudo,
        catalogueGroupe: this.data.catalogueGroupe,
        role: this.data.role._id
      });
      this.userForm.controls['password'].clearValidators();
    }

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(UserSelector.selectState)
    ).subscribe(({loading, errorMessage}) => {
      this.loading = loading;
      if (!loading && this.submitting) {
        if (errorMessage) {
          this.errorMessage = `⚠️ ${errorMessage}`
          this.userForm.enable();
          this.userForm.controls.password.reset();
        } else {
          this.modalRef.close()
        }
        this.submitting = false;
      }
    });

    combineLatest([
      this.store.select(RoleSelector.selectAll),
      this.store.select(CatalogueGroupeSelector.selectAll)
    ]).pipe(
      takeUntil(super.unsubscribe()),
      filter(([roles, catalogueGroupes]) => !!roles && !!catalogueGroupes)
    ).subscribe(([roles, catalogueGroupes]) => {
      this.roles = (roles && [...roles]) || [];
      this.catalogueGroupes = (catalogueGroupes && [...catalogueGroupes]) || [];
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.userForm.disable();
    this.submitting = true;

    if (this.isUpdate) {
      const changes = this.userForm.value as User.UpdateInput;
      if (!changes.password || changes.password?.length === 0) {
        delete changes.password;
      }
      this.store.dispatch(UserActions.UPDATE_REQUESTED({
        id: this.data._id,
        changes
      }))
    } else {
      this.store.dispatch(UserActions.CREATE_REQUESTED({
        input: this.userForm.value as User.CreateInput
      }))
    }

  }

}
