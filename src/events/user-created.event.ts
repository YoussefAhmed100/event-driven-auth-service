export class UserEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly fullName: string,
  ) {}
}