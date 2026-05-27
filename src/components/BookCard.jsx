import { FaEdit, FaTrash } from 'react-icons/fa';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Author:</span> {book.author}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Genre:</span> {book.genre}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Year:</span> {book.publicationYear}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(book)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaEdit size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <FaTrash size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;