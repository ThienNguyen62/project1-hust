import { Router } from 'express';
import { recordError } from '../services/record-error.js';

function readId(value) {
  if (!/^[1-9]\d*$/.test(value) || Number(value) > 2147483647) {
    throw recordError(400, 'ID không hợp lệ.');
  }
  return Number(value);
}

export function recordRouter(path, service) {
  const router = Router();
  router.get(path, async (req, res) => {
    res.json({ data: await service.list(readId(req.params.yearId)) });
  });
  router.post(path, async (req, res) => {
    res.status(201).json({ data: await service.save(readId(req.params.yearId), req.body) });
  });
  router.put(path + '/:id', async (req, res) => {
    res.json({ data: await service.save(readId(req.params.yearId), req.body, readId(req.params.id)) });
  });
  router.delete(path + '/:id', async (req, res) => {
    const id = readId(req.params.id);
    await service.remove(readId(req.params.yearId), id);
    res.json({ data: { id } });
  });
  router.use((error, req, res, next) => {
    if (!error.recordStatus) return next(error);
    res.status(error.recordStatus).json({ message: error.message });
  });
  return router;
}
