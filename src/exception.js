export class SandboxUnexpectedException extends Error {
  constructor(message) {
    super(message);
    this.name = "SandboxUnexpectedException";
  }
}

export class SandboxParamException extends Error {
  constructor(message) {
    super(message);
    this.name = "SandboxParamException";
  }
}

export class SandboxExecutionException extends Error {
  constructor(message) {
    super(message);
    this.name = "SandboxExecutionException";
  }
}