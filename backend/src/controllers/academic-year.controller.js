export function createAcademicYearController(service) {
  return {
    async list(req, res) {
      res.json({ data: await service.list() });
    },

    async create(req, res) {
      const { status, ...body } = await service.save(req.body);
      res.status(status).json(body);
    },

    async update(req, res) {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'ID không hợp lệ.' });
      const { status, ...body } = await service.save(req.body, id);
      res.status(status).json(body);
    },

    async remove(req, res) {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'ID không hợp lệ.' });
      const { status, ...body } = await service.remove(id);
      res.status(status).json(body);
    },
  };
}
