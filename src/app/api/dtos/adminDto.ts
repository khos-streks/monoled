export class AdminDto {
  login: string;
  id: number;

  constructor(model: {
    login: string;
    id: number;
  }) {
    this.login = model.login;
    this.id = model.id;
  }
}
