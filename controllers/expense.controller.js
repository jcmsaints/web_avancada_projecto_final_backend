const router = require("express").Router();
let Expense = require("../dto/expense.dto");

router.route("/").get(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  var query = {};
  if (req.query) {
    if (req.query.startDate && req.query.endDate) {
      let queryByDate = {
        date: {
          $gte: Date.parse(req.query.startDate),
          $lt: Date.parse(req.query.endDate),
        },
      };
      query = Object.assign(query, queryByDate);
    }
    if (req.query.filterByCat) {
      if (Array.isArray(req.query.filterByCat)) {
        req.query.filterByCat = [req.query.filterByCat];
      }
      let queryByCat = {
        categoryId: { $in: req.query.filterByCat },
      };
      query = Object.assign(query, queryByCat);
    }
    query = Object.assign(query, { email: { $in: req.query.email } });
  }

  try {
    var sortValues = req.query.sort.split("_");
    var field = sortValues[0];
    var order = Number(sortValues[1]);
    if (field == "date") {
      var expenses = await Expense.find(query)
        .limit(limit * 1)
        .sort({ date: order })
        .skip((page - 1) * limit)
        .exec();
    }
    if (field == "value") {
      var expenses = await Expense.find(query)
        .limit(limit * 1)
        .sort({ value: order })
        .skip((page - 1) * limit)
        .exec();
    }

    // get total documents in the Posts collection
    const count = await Expense.countDocuments(query);

    // return response with posts, total pages, and current page
    res.json({
      data: expenses,
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
    const expense = await Expense.findById(id).exec();

    res.json({
      data: expense,
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/add").post((req, res) => {
  const description = req.body.description;
  const categoryName = req.body.categoryName;
  const email = req.body.email;
  const categoryId = req.body.categoryId;
  const value = Number(req.body.value);
  const date = Date.parse(req.body.date);

  const newExpense = new Expense({
    date,
    categoryId,
    categoryName,
    value,
    description,
    email,
  });
  newExpense
    .save()
    .then(() => res.json("Expense added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Expense.findById(req.params.id)
    .then((expense) => res.json(expense))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").get((req, res) => {
  Expense.findByIdAndDelete(req.params.id)
    .then(() => res.json("Expense deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Expense.findById(req.params.id)
    .then((expense) => {
      expense.description = req.body.description;
      expense.categoryName = req.body.categoryName;
      expense.email = req.body.email;
      expense.categoryId = req.body.categoryId;
      expense.value = Number(req.body.value);
      expense.date = Date.parse(req.body.date);
      expense
        .save()
        .then(() => res.json("Expense updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
