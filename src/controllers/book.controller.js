import { BookService } from "../services/books.service.js";

const getAllBooks = async (req, res) => {
  try {
    const books = await BookService.getAll();
    req.flash('success_msg', 'RETRIEVED ALL BOOKS SUCCESSFULLY!');
      res.render('books/index', { books });
  } catch (err) {
    req.flash('error_msg', err.message);
      res.redirect('books/index');
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const newBook = await BookService.create(req.validatedData);
    return res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await BookService.update(id, req.body);
    if (!updated) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookService.remove(id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export {getAllBooks, getBookById, createBook, updateBook, deleteBook}