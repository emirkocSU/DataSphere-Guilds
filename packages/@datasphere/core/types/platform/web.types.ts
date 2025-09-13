/** @fileoverview Types specific to web platform capabilities. */

export interface WebCapabilities {
  readonly hasWebGl: boolean;
  readonly hasWebAssembly: boolean;
  readonly hasServiceWorker: boolean;
  readonly hasPushApi: boolean;
}

export interface PwaFeatures {
  readonly isInstallable: boolean;
  readonly canRunOffline: boolean;
}
