import { readFileSync, existsSync } from 'fs';

import { WorkerVM } from './vm';

function handleScript(script: string, scriptPath: string) {
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

export class WorkerSandbox extends WorkerVM {
  constructor({ script = '', scriptPath = '' }) {
    const vmInitOptions = {
      script: handleScript(script, scriptPath),
    };

    super(vmInitOptions);
  }
}
