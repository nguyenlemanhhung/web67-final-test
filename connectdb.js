const express = require("express");

const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri =
  "mongodb+srv://nohssiw1905:ailopdu281186.@mindxnodejs.b99ioni.mongodb.net/";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function connectDb() {
  try {
    await client.connect();
  } finally {
  }
}

module.exports = {
  connectDb,
  client,
};
