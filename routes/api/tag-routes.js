const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findByPk(tagId, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  const tagId = req.params.id;
  try {
    const [updatedRowsCount] = await Tag.update(req.body, {
      where: { id: tagId },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  const tagId = req.params.id;
  try {
    const deletedRowsCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Also, delete associated entries in the ProductTag model
    await ProductTag.destroy({
      where: { tag_id: tagId },
    });

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
