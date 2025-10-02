const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const res = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  res.code(201);
  return res;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    const readingNum = Number(reading);
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.reading) === readingNum
    );
  }

  if (finished !== undefined) {
    const finishedNum = Number(finished);
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.finished) === finishedNum
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = books.find((book) => book.id === bookId);

  if (book === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    res.code(404);
    return res;
  }

  const res = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  res.code(200);
  return res;
};

const updateBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    res.code(404);
    return res;
  }

  if (name === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const updatedAt = new Date().toISOString();

  const updatedBook = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  books[index] = updatedBook;

  const res = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  res.code(200);
  return res;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const res = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    res.code(404);
    return res;
  }

  books.splice(index, 1);

  const res = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  res.code(200);
  return res;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
