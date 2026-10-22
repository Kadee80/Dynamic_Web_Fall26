const BookList = (props) => {
  const {books} = props

  // before we do any thinking or rendering, exit out with a simple p tag message
  // if books is empty.
  if (books.length === 0) {
    return <p className="mt-8 text-gray-500">Nothing on the list yet!</p>
  }

  return (
    <ul className="mt-8 divide-y divide-gray-300">
      {books.map((book) => {
        return (
          <li key={book.id}>
            <p>
              {book.title}
              {book.finished && (
                <span className="ml-2 text-green-700">done</span>
              )}
            </p>
            <p className="text-sm text-gray-600">
              {book.author} • {book.format} • {book.pages} pages • rated:{' '}
              {book.rating}
              /5
            </p>
            {book.dateStarted && (
              <p className="text-sm text-gray-500">{book.dateStarted}</p>
            )}
            {book.notes && <p className="mt-1 text-sm">{book?.notes}</p>}
          </li>
        )
      })}
    </ul>
  )
}

export default BookList
