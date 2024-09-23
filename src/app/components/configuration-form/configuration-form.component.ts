import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import {
  ConfigurationService,
  LawnMowerService,
  SelectedModelService,
} from '../../services';
import { ConfigurationData, EngineType } from '../../models';

@Component({
  selector: 'app-configuration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './configuration-form.component.html',
  styleUrls: ['./configuration-form.component.css'],
})
export class ConfigurationFormComponent implements OnInit, OnDestroy {
  configurationForm!: FormGroup;
  engineTypes = Object.values(EngineType);
  brands: string[] = [];
  models: string[] = [];
  selectedEngineType: EngineType | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private lawnMowerService: LawnMowerService,
    private selectedModelService: SelectedModelService,
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configurationForm = this.fb.group({
      engineType: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
    });

    this.configurationForm
      .get('brand')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        switchMap((brand: string) => this.lawnMowerService.getModels(brand))
      )
      .subscribe((models) => (this.models = models));

    this.configurationForm
      .get('model')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((model: string) => {
        this.selectedModelService.setSelectedModel(model);
      });

    this.configurationForm
      .get('engineType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((engineType: EngineType) => {
        this.selectedEngineType = engineType;
        this.updateFormControls(engineType);
      });

    this.lawnMowerService
      .getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe((brands) => (this.brands = brands));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateFormControls(engineType: EngineType): void {
    const controlNames = ['combustionSpecs', 'electricSpecs', 'batterySpecs'];
    controlNames.forEach((controlName) => {
      if (this.configurationForm.contains(controlName)) {
        this.configurationForm.removeControl(controlName);
      }
    });

    if (engineType === EngineType.Combustion) {
      this.configurationForm.addControl(
        'combustionSpecs',
        this.fb.group({
          engineCapacity: [
            null,
            [Validators.required, Validators.min(50), Validators.max(200)],
          ],
          tankCapacity: [
            null,
            [Validators.required, Validators.min(0.1), Validators.max(1)],
          ],
          cuttingLevels: [
            null,
            [Validators.required, Validators.min(5), Validators.max(7)],
          ],
        })
      );
    } else if (engineType === EngineType.Electric) {
      this.configurationForm.addControl(
        'electricSpecs',
        this.fb.group({
          cableLength: [
            null,
            [Validators.required, Validators.min(10), Validators.max(30)],
          ],
          bladesCount: [
            null,
            [Validators.required, Validators.min(1), Validators.max(4)],
          ],
          color: ['', Validators.required],
        })
      );
    } else if (engineType === EngineType.Battery) {
      this.configurationForm.addControl(
        'batterySpecs',
        this.fb.group({
          batteryCount: [
            null,
            [Validators.required, Validators.min(1), Validators.max(3)],
          ],
          batteryCapacity: [
            null,
            [Validators.required, Validators.min(2), Validators.max(4)],
          ],
          color: ['', Validators.required],
        })
      );
    }
  }

  onSubmit(): void {
    if (this.configurationForm.valid) {
      const configurationData: ConfigurationData = this.configurationForm.value;

      this.configurationService.setConfigurationData(configurationData);

      this.router.navigate(['/order']);
    } else {
      console.log('Formularz zawiera błędy.');
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched(): void {
    this.configurationForm.markAllAsTouched();
  }
}
