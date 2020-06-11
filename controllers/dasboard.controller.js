const router = require("express").Router();
let Expense = require("../dto/expense.dto");
let Category = require("../dto/expense.dto");
router.route("/").get(async (req, res) => {
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
    query = Object.assign(query, { email: { $in: req.query.email } });
  }

  try {
    var expenses = await Expense.find(query).exec();

    // return response with posts, total pages, and current page
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
  const { page = 1, limit = 10 } = req.query;

  try {
    var categories = await Category.find({ email: req.query.email })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    var count = await Category.countDocuments({ email: req.query.email });

    // return response with posts, total pages, and current page
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
  let totalExpense = 0;
  let expenseChartMap = new Map();
  for (category in categories) {
    expenseChartMap.set(categories[category].categoryName, 0);
  }
  if (categories.length > 0) {
    for (expense in expenses) {
      totalExpense += Number(expenses[expense].value);
      if (expenseChartMap.get(expenses[expense].categoryName)) {
        expenseChartMap.set(
          expenses[expense].categoryName,
          expenses[expense].value +
            expenseChartMap.get(expenses[expense].categoryName)
        );
      } else {
        expenseChartMap.set(
          expenses[expense].categoryName,
          Number(expenses[expense].value)
        );
      }
    }
  }

  let expenseChart = [];
  expenseChartMap.forEach(function (value, key) {
    expenseChart.push({
      label: key,
      total: value,
      percentage: Math.round((value * 100) / totalExpense),
    });
  }, expenseChartMap);
  expenseChart = expenseChart.sort(function (a, b) {
    return parseFloat(b.total) - parseFloat(a.total);
  });
  res.json({
    data: expenseChart,
    totalSpent: totalExpense,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

module.exports = router;
