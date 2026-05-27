import { useState, useEffect } from 'react';
import { bookApi } from './services/api';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import SearchAndFilter from './components/SearchAndFilter';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookApi.getAllBooks();
      console.log('API response:', response.data);
      // Ensure we set an array (MockAPI returns array directly)
      const booksArray = Array.isArray(response.data) ? response.data : [];
      setBooks(booksArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load books. Check API URL or network.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books – safe with array check
  useEffect(() => {
    if (!Array.isArray(books)) {
      setFilteredBooks([]);
      return;
    }
    let filtered = [...books];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term)
      );
    }
    if (selectedGenre !== 'ALL') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }
    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedGenre]);

  // Safe genres extraction
  const genres = Array.isArray(books)
    ? [...new Set(books.map(book => book.genre).filter(Boolean))]
    : [];

  const handleAddBook = async (bookData) => {
    setFormLoading(true);
    try {
      const response = await bookApi.createBook(bookData);
      setBooks(prev => [...prev, response.data]);
      setEditingBook(null);
    } catch (err) {
      setError('Failed to add book.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook?.id) return;
    setFormLoading(true);
    try {
      const response = await bookApi.updateBook(editingBook.id, bookData);
      setBooks(prev =>
        prev.map(book => (book.id === editingBook.id ? response.data : book))
      );
      setEditingBook(null);
    } catch (err) {
      setError('Failed to update book.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!id) return;
    if (window.confirm('Delete this book?')) {
      try {
        await bookApi.deleteBook(id);
        setBooks(prev => prev.filter(book => book.id !== id));
        if (editingBook?.id === id) setEditingBook(null);
      } catch (err) {
        setError('Failed to delete book.');
        console.error(err);
      }
    }
  };

  const handleEditClick = (book) => setEditingBook(book);
  const handleCancelEdit = () => setEditingBook(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book Management System</h1>
          <p className="text-gray-600">Manage your book collection with ease</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">×</button>
          </div>
        )}

        <BookForm
          initialData={editingBook}
          onSubmit={editingBook ? handleUpdateBook : handleAddBook}
          onCancel={editingBook ? handleCancelEdit : null}
          isLoading={formLoading}
        />

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          genres={genres}
        />

        <BookList
          books={filteredBooks}
          onEdit={handleEditClick}
          onDelete={handleDeleteBook}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

export default App;