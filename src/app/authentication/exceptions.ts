export class UserNotFoundError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'User not found';
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'Invalid password';
    this.name = 'InvalidPasswordError';
  }
}

export class UsernameAlreadyInUseError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'Username already in use';
    this.name = 'UsernameAlreadyInUseError';
  }
}

export class EmailAlreadyInUseError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'Email already in use';
    this.name = 'EmailAlreadyInUseError';
  }
}

export class CouldntLogoutError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'User could not loggout';
    this.name = 'CouldntLogoutError';
  }
}

export class InvalidRegistrationCode implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.message = 'Invalid registration code';
    this.name = 'InvalidRegistrationCode';
  }
}
