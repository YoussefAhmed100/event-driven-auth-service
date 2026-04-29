export interface INotification {
  send(email: string, message: string): Promise<void>;
}