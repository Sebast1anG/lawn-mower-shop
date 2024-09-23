import { BatterySpecs } from './battery-specs.model';
import { CombustionSpecs } from './combustion-specs.model';

export interface ConfigurationData {
  engineType: string;
  brand: string;
  model: string;
  combustionSpecs?: CombustionSpecs;
  batterySpecs?: BatterySpecs;
  electricSpecs?: {
    cableLength: number;
    bladesCount: number;
    color: string;
  };
}
