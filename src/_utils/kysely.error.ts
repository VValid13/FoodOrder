export class KyselyError extends Error {
  constructor(code: string, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
  code: string;
  message: string;
}
