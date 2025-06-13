/*

loadProject.js
Brian Glen

Electron-specific functions for loading project files

*/

import * as fs from 'fs';
import { parseProjectFile } from '../../wire-harness-core/src/core/io/loader.js';
import { setProject, getProject } from '../../wire-harness-core/src/core/state/projectState.js';

window.loadProject = async () => {
  const input = document.getElementById('projectFileInput');
  if (!input.files.length) return;

  const file = input.files[0];
  const path = file.path; // Electron-specific

  let content;
  try {
    content = fs.readFileSync(path, 'utf-8'); // Use fs exposed by contextBridge
  } catch (err) {
    console.error(err);
    document.getElementById('status').textContent = 'Failed to read file.';
    return;
  }

  const result = parseProjectFile(content);

  const statusEl = document.getElementById('status');
  if (result.error) {
    statusEl.textContent = `Error: ${result.error}`;
    console.error(result.details);
  } else {
    setProject(result.data); // Load into project state
    statusEl.textContent = `Loaded project: ${getProject().project.name}`;
  }
};
