router.get('/multi-project', async (req, res) => {
  const { projectIds } = req.query;
  const tasks = await Task.find({ projectId: { $in: projectIds.split(',') } });
  res.json(tasks);
});