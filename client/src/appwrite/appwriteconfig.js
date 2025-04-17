import { Client, Account, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67fccb690025c854d017");

export const account = new Account(client);
export const storage = new Storage(client);
