import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Router} from "@angular/router";
import {TokenService} from "./token.service";
import {ModalConfirmationService} from "./modal-confirmation.service";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket,
    private router: Router,
    private tokenService: TokenService,
    private modalConfirmation: ModalConfirmationService,
    private modal: MatDialog
  ) {
  }

  ModalNotification(content: string, onConfirm: Function): void {
    const modalRef = {
      title: 'Notification',
      content,
      confirmLabel: 'OK',
      showConfirm: true,
      showCancel: false,
      lottie: 'assets/lotties/alert.json',
      onConfirm
    }
    this.modalConfirmation.openModal({data: modalRef, disableClose: true});
  }

  DuplicateConnectionHandler = ()  => {
    this.tokenService.removeToken();
    const message = '<p>Un autre appareil vient de se connecter avec votre compte.<br>' +
      'Vous ne pouvez pas se connecter en même temps sur un même compte.</p>' +
      '<p>Veuillez contactez notre technicien si besoin. <b>+261 34 84 332 26</b> Tsiory</p>';

    this.ModalNotification(message, () => {
      this.modal.closeAll();
      this.router.navigateByUrl('/auth/login');
    })
  }

  DisconnectedUserHandler = () => {
    this.tokenService.removeToken();
    const message = '<p>Votre compte a été déconnecté par Pharmabot.</p>' +
      '<p>Veuillez contactez notre technicien si besoin. <b>+261 34 84 332 26</b> Tsiory</p>';

    this.ModalNotification(message, () => {
      this.modal.closeAll();
      this.router.navigateByUrl('/auth/login');
    })
  }

  init(): void {
    this.socket.on('disconnected', this.DuplicateConnectionHandler);
    this.socket.on('disconnected-user', this.DisconnectedUserHandler);
  }
}
