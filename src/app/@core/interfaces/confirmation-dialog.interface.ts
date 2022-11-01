interface IConfirmationDialog {
  lottie?: string;
  title?: string;
  content?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
  icon?: string;
  customIcon?: string;
  loading?: boolean;
  onCancel?: Function;
  onConfirm?: Function;
}

export {
  IConfirmationDialog
}
