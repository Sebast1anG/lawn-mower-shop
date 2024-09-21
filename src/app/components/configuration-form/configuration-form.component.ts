import { Component, OnInit } from '@angular/core';
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
import { LawnMowerService } from '../../services/lawn-mower.service';
import { SelectedModelService } from '../../services/selected-model.service';
import { EngineType } from '../../models/engine-type.enum';

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
  ],
  templateUrl: './configuration-form.component.html',
  styleUrls: ['./configuration-form.component.css'],
})
export class ConfigurationFormComponent implements OnInit {
  configurationForm!: FormGroup;
  engineTypes = Object.values(EngineType);
  brands: string[] = [];
  models: string[] = [];
  selectedEngineType: EngineType | null = null;

  constructor(
    private fb: FormBuilder,
    private lawnMowerService: LawnMowerService,
    private selectedModelService: SelectedModelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configurationForm = this.fb.group({
      engineType: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
    });

    this.lawnMowerService
      .getBrands()
      .subscribe((brands) => (this.brands = brands));

    this.configurationForm
      .get('engineType')
      ?.valueChanges.subscribe((engineType: EngineType) => {
        this.selectedEngineType = engineType;
        this.updateFormControls(engineType);
      });

    this.configurationForm
      .get('brand')
      ?.valueChanges.subscribe((brand: string) => {
        this.lawnMowerService
          .getModels(brand)
          .subscribe((models) => (this.models = models));
      });

    this.configurationForm
      .get('model')
      ?.valueChanges.subscribe((model: string) => {
        this.selectedModelService.setSelectedModel(model);
      });
  }

  updateFormControls(engineType: EngineType): void {
    if (this.configurationForm.contains('combustionSpecs')) {
      this.configurationForm.removeControl('combustionSpecs');
    }
    if (this.configurationForm.contains('electricSpecs')) {
      this.configurationForm.removeControl('electricSpecs');
    }
    if (this.configurationForm.contains('batterySpecs')) {
      this.configurationForm.removeControl('batterySpecs');
    }

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
      const configurationData = this.configurationForm.value;

      sessionStorage.setItem(
        'configurationData',
        JSON.stringify(configurationData)
      );

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
