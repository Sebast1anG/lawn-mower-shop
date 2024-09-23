import { BatterySpecs, CombustionSpecs } from '../models';

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
