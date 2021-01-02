import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import initializeApp from './app';

const app = initializeApp(express, bodyParser, fs, crypto, http);

export default app;
