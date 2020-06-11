const router = require("express").Router();
let Category = require("../dto/category.dto");

router.route("/").get(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const categories = await Category.find({ email: { $in: req.query.email } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    const count = await Category.countDocuments({
      email: { $in: req.query.email },
    });

    // return response with posts, total pages, and current page
    res.json({
      data: categories,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/id").get(async (req, res) => {
  const id = req.query.id;
  try {
    const category = await Category.findById(id).exec();

    res.json({
      data: category,
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/add").post((req, res) => {
  const email = req.body.email;
  const name = req.body.name;

  const newCategory = new Category({
    name,
    email,
  });
  newCategory
    .save()
    .then(() => res.json("Category added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Category.findById(req.params.id)
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").get((req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => res.json("Category deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      category.email = req.body.email;
      category.name = req.body.name;

      category
        .save()
        .then(() => res.json("Category updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
