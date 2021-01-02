import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import initializeApp from './app.js';

const DEFAULT_PORT = 4321;
const PORT = process.env.PORT
  ? Number.parseInt(process.env.PORT, 10)
  : DEFAULT_PORT;

export default initializeApp(express, bodyParser, fs, crypto, http).listen(
  PORT,
  () => {
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(`http://localhost:${PORT}\n`);
    }
  }
);
