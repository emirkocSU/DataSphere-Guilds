/** @fileoverview Types specific to desktop platform capabilities. */

export interface DesktopCapabilities {
  readonly hasFileSystemAccess: boolean;
  readonly hasSystemTray: boolean;
  readonly hasNativeMenus: boolean;
  readonly canAutoUpdate: boolean;
}
