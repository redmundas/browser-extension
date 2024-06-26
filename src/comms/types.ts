// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MsgBody = any;
export type Message<T = MsgBody> = { type: string; data: T };
