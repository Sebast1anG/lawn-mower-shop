import { EngineType } from './engine-type.enum';
import { CombustionSpecs } from './combustion-specs.model';
import { ElectricSpecs } from './electric-specs.model';
import { BatterySpecs } from './battery-specs.model';

export interface LawnMower {
  engineType: EngineType;
  brand: string;
  model: string;
  combustionSpecs?: CombustionSpecs;
  electricSpecs?: ElectricSpecs;
  batterySpecs?: BatterySpecs;
}
