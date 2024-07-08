const asyncHandler = require("express-async-handler");
const slqHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");

// @desc    Add New Book
// @route   POST /api/Book/
// @access  Public
const addBook = asyncHandler(async (req, res) => {
  // console.log(req.body);
  try {
    const newBook = slqHelper.fetchParams(req.body);
    const result = await slqHelper.execute(`sp_BookAdd`, newBook);
    resultHelper.createStatus(result, res);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});
// @desc    Get All Book
// @route   GET /api/Book
// @access  Public
const getAllBook = asyncHandler(async (req, res) => {
  try {
    const result = await slqHelper.execute(`sp_BookGetAll`);
    resultHelper.getStatus(result, res);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// @desc    Get Book by id
// @route   GET /api/Book/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  try {
    const result = await slqHelper.execute(`sp_BookGetById`, [
      { name: "BookTypeId", value: req.params.BookTypeId },
    ]);
    resultHelper.getStatusById(result, res);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// @desc    Update Book
// @route   PUT /api/Book/:id
// @access  Public
const updateBook = asyncHandler(async (req, res) => {
  const reqId = parseInt(req.params.id);
  console.log(reqId);
  console.log(req.body.id)
  try {
    if (reqId !== req.body.id) {
      res.status(400).json({
        message: "Mismatched identity",
        body: req.body,
        param: req.params.id,
      });
      return;
    }

    const result = await slqHelper.execute(`sp_BookGetById`, [
      { name: "id", value: reqId },
    ]);

    let Book = result.recordset.length ? result.recordset[0] : null;
    if (Book) {
      const UpdateBook = slqHelper.fetchParams(req.body);
      const Updateresult = await slqHelper.execute(`sp_BookUpdate`, UpdateBook);
      console.log(Updateresult)

      
      
      res.status(200).json({message:Updateresult.recordset[0].MSG});
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// @desc    Delete Book
// @route   DELETE /api/Book/:id
// @access  Public
const deleteBook = asyncHandler(async (req, res) => {
  const reqId = parseInt(req.params.id);
  try {
    const result = await slqHelper.execute(`sp_BookGetById`, [
      { name: "Id", value: reqId },
    ]);

    let Book = result.recordset.length ? result.recordset[0] : null;
    if (Book) {
      const result = await slqHelper.execute(`sp_BookDelete`, [
        {
          name: "Id",
          value: reqId,
        },
      ]);
      res.status(200).json({
        message: result.recordset[0].Message,
      });
    } else {
      res.status(404).json({
        message:result.recordset[0].MSG});
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// @desc    Search Book
// @route   GET /api/Book/search?name=zo
// @access  Public
const searchBook = asyncHandler(async (req, res) => {
  try {
    const result = await slqHelper.execute(`SearchBook`, [
      { name: "Name", value: req.query.name },
    ]);
    const Book = result.recordset;
    res.status(200).json(Book);
  } catch (error) {
    res.status(500).json(error);
  }
});

// @desc    Book Status
// @route   GET /api/Book/status
// @access  Public
const getBooktatus = asyncHandler(async (req, res) => {
  try {
    const result = await slqHelper.execute(
      `GetBookStatus`,
      [],
      [
        { name: "Count", value: 0 },
        { name: "Max", value: 0 },
        { name: "Min", value: 0 },
        { name: "Average", value: 0 },
        { name: "Sum", value: 0 },
      ]
    );
    const status = {
      Count: +result.output.Count,
      Max: +result.output.Max,
      Min: +result.output.Min,
      Average: +result.output.Average,
      Sum: +result.output.Sum,
    };

    res.json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

// @desc    Add Many Book
// @route   POST /api/Book/many
// @access  Public
// const AddManyBook = asyncHandler(async (req, res) => {
//   try {
//     const Book = req.body;
//     const BookTable = slqHelper.generateTable(
//       [
//         { name: "email", type: slqHelper.mssql.TYPES.VarChar(50) },
//         { name: "Name", type: slqHelper.mssql.TYPES.VarChar(50) },
//         { name: "password", type: slqHelper.mssql.TYPES.VarChar(50) },
//         { name: "EmployTypeId", type: slqHelper.mssql.TYPES.Int },
//         // { name: "Department", type: slqHelper.mssql.TYPES.VarChar(50) },
//       ],
//       Book
//     );

//     const result = await slqHelper.execute(`AddBook`, [
//       { name: "Book", value: BookTable },
//     ]);
//     const newBook = result.recordset;
//     res.json(newBook);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

// @desc    Login User
// @route   POST /api/Book
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const loginDetails = slqHelper.fetchParams(req.body);
  try {
    const result = await slqHelper.execute(`loginDetails`, loginDetails);
    res.status(200).json({
      data: result.recordset[0],
      token: generateToken(result.recordset[0].Id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = {
  getAllBook,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
  getBooktatus,
  AddManyBook,
  loginUser,
};


