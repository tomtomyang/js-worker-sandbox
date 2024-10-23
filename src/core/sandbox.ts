import { readFileSync, existsSync } from 'fs';

import { WorkerVM } from './vm';

function loadScript(script: string, scriptPath: string) {
  if (script && typeof script === 'string' && script.length > 0) {
    return script;
  }

  if (
    scriptPath &&
    typeof scriptPath === 'string' &&
    scriptPath.length > 0 &&
    scriptPath.endsWith('.js') &&
    existsSync(scriptPath)
  ) {
    return readFileSync(scriptPath, 'utf8');
  }

  return '';
}

export class WorkerSandBox extends WorkerVM {
  constructor({ script = '', scriptPath = '' }) {
    const vmInitOptions = {
      script: loadScript(script, scriptPath),
    };

    super(vmInitOptions);
  }
}
