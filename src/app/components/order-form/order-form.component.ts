import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService, SelectedModelService } from '../../services';
import { Order, PaymentType, DeliveryType } from '../../models';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  paymentTypes = Object.values(PaymentType);
  deliveryTypes = Object.values(DeliveryType);
  submittedData: Order | null = null;

  modelPrices: { [key: string]: number } = {
    XTR100: 1200,
    XTR200: 1300,
    CUT2000: 900,
    CUT3000: 1000,
    MKE54231: 1100,
    TUM4110: 1150,
  };

  selectedModel: string = '';
  minDate: Date;

  private destroy$ = new Subject<void>();

  futureDateValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate <= currentDate ? { pastDate: true } : null;
  };

  constructor(
    private fb: FormBuilder,
    private selectedModelService: SelectedModelService,
    private orderService: OrderService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      paymentType: ['', Validators.required],
      deliveryType: ['', Validators.required],
      deliveryDate: [null, [Validators.required, this.futureDateValidator]],
      deliveryTime: ['', Validators.required],
      deliveryAddress: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        houseNumber: ['', Validators.required],
        apartmentNumber: [''],
        postalCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}$')],
        ],
        city: ['', Validators.required],
      }),
      authorizedUsers: this.fb.array([this.createAuthorizedUser()]),
      price: [{ value: 0, disabled: true }, Validators.required],
    });

    this.selectedModelService.selectedModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((model) => {
        if (model) {
          this.selectedModel = model;
          this.updatePrice();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createAuthorizedUser(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      apartmentNumber: [''],
      postalCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}$')],
      ],
      city: ['', Validators.required],
    });
  }

  addAuthorizedUser(): void {
    this.authorizedUsers.push(this.createAuthorizedUser());
  }

  removeAuthorizedUser(index: number): void {
    this.authorizedUsers.removeAt(index);
  }

  updatePrice(): void {
    const price = this.modelPrices[this.selectedModel] || 0;
    this.orderForm.get('price')?.setValue(price);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const deliveryDate = this.orderForm.value.deliveryDate;
      const deliveryTime = this.orderForm.value.deliveryTime;

      const timeParts = deliveryTime.split(':');
      if (timeParts.length !== 2) {
        console.log('Niepoprawny format czasu dostawy.');
        this.orderForm.get('deliveryTime')?.setErrors({ invalidFormat: true });
        return;
      }

      const [hours, minutes] = timeParts.map((val: string) =>
        parseInt(val, 10)
      );
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        console.log('Niepoprawny czas dostawy.');
        this.orderForm.get('deliveryTime')?.setErrors({ invalidTime: true });
        return;
      }

      const deliveryDateTime = new Date(deliveryDate);
      deliveryDateTime.setHours(hours, minutes, 0, 0);

      const orderData: Order = {
        paymentType: this.orderForm.value.paymentType,
        deliveryType: this.orderForm.value.deliveryType,
        deliveryDateTime: deliveryDateTime,
        deliveryAddress: this.orderForm.value.deliveryAddress,
        authorizedUsers: this.orderForm.value.authorizedUsers,
        price: this.orderForm.get('price')?.value,
      };

      this.orderService.setOrderData(orderData);

      this.router.navigate(['/summary']);
    } else {
      console.log('Formularz zawiera błędy.');
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched(): void {
    this.orderForm.markAllAsTouched();
  }

  get authorizedUsers(): FormArray {
    return this.orderForm.get('authorizedUsers') as FormArray;
  }
}
