import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class HelperService {

  constructor(private snackBar: MatSnackBar) {}

  getSubDomain(){
    let subdomain = '';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 0) {
      subdomain = parts[0];
    }
    return subdomain;
  }

  openMessageSnackBar(message: any, action: string) {
    console.log('message', message);
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snack']
    });
  }
  openErrorMessageSnackBar(message: any, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snack']
    });
  }

  openErrorSnackBar(message: any, action: string) {
    let errorMessage = '';
    if (message.data?.errors) {
      let validationErrors = message.data.errors;
      let errorMessages = Object.values(validationErrors);
      errorMessage += errorMessages.join('\n');
    } else if (message.data?.message) {
      if (typeof message.data.message === 'string') {
        if (message.data.message.includes(".")) {
          let messageParts = message.data.message.split(".");
          let validParts = messageParts.filter((part: any) => part.trim().length > 0);
          for (let prop in validParts) {
            errorMessage += validParts[prop] + '\n';
          }
        } else {
          errorMessage = message.data.message;
        }
      } else {
        let messageParts = message.data.message;
        for (let prop in messageParts) {
          errorMessage += messageParts[prop] + '\n';
        }
      }

    } else if (message?.error?.message?.validator?.customMessages) {
      let validationErrors = message.error.message.validator.customMessages;
      validationErrors.forEach((element: string) => {
        errorMessage += element + '\n';
      });
    } else if (message?.error?.message){
      errorMessage = message.error.message;
    } else {
      errorMessage = message;
    }

    this.snackBar.open(errorMessage, action, {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snack']
    });

  }

  openValidateErrorSnackBar(message: any, action: string) {
    let errorMessage = '';
    if (message.data?.errors) {
      let validationErrors = message.data.errors;
      for (let prop in validationErrors) {
        errorMessage += validationErrors[prop] + '\n';
      }
    } else if (message.error?.message) {
      if (message.error.message?.validator) {
        let validationErrors = message.error.message.validator.customMessages;
        for (let prop in validationErrors) {
          errorMessage += validationErrors[prop] + '\n';
        }
      } else {
        errorMessage = message.error.message
      }
    } else {
      errorMessage = message;
    }

    this.snackBar.open(errorMessage, action, {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snack']
    });

  }

}