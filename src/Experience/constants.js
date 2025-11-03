import { Vector3 } from 'three';

// Screen dimensions (HTML size in pixels)
export const MONITOR_SCREEN_WIDTH = 1920;
export const MONITOR_SCREEN_HEIGHT = 1080;

// Main Monitor CSS3D Configuration
export const MAIN_MONITOR_CSS_OBJECT_POSITION = new Vector3(
  132.595,   // X position
  353.927,   // Y position
  -420.172   // Z position
);

export const MAIN_MONITOR_CSS_OBJECT_SCALE = new Vector3(
  0.1765,  // X scale
  0.1765,  // Y scale
  1        // Z scale
);

export const MAIN_MONITOR_IFRAME_SRC = '/main-monitor-content.html';
export const MONITOR_IFRAME_PADDING = '0px';
