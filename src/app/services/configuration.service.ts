import { Injectable } from '@angular/core';
import { ConfigurationData } from '../models/configuration.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configurationData: ConfigurationData | null = null;

  setConfigurationData(configuration: ConfigurationData): void {
    this.configurationData = configuration;
  }

  getConfigurationData(): ConfigurationData | null {
    return this.configurationData;
  }
}
