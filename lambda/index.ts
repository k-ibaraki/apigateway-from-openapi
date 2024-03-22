import serverlessExpress from '@codegenie/serverless-express';
import cors from 'cors';
import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

// クエリパラメータを取得する
app.get('/query/', async (req: Request, res: Response): Promise<void> => {
  res.send({ id: req.query.id });
});

// パスパラメータを取得する
app.get('/path/:id', async (req: Request, res: Response): Promise<void> => {
  res.send({ id: req.params.id });
});

export const handler = serverlessExpress({ app });