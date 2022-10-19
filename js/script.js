document.addEventListener('DOMContentLoaded', () => {
  const inputForm = document.querySelector('.input-form');
  const bookList = document.querySelector('.books-list');
  const bookList2 = document.querySelector('.second');
  const searchSection = document.querySelector('.search-results');
  const bookAddForm = document.querySelector('#add-book-form');

  bookAddForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    alert('book Saved');
    inputForm.classList.add('display-none');
    bookList.classList.remove('display-none');
    bookList2.classList.remove('display-none');
    searchSection.classList.add('display-none');
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const bookSection = document.querySelector('.books');
  const searchForm = document.querySelector('#search-form');

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    findBookByYear();
    bookSection.classList.add('display-none');
    searchSection.classList.remove('display-none');
  });
});

const findBookByYear = () => {
  const searchVal = document.querySelector('#search').value;
  const searchResult = document.querySelector('#result');
  searchResult.innerHTML = '';
  for (const book of books) {
    if (book.year == `${searchVal}`) {
      searchResult.append(makeBook(book));
    }
  }
};

const addBook = () => {
  const bookTitle = document.querySelector('#book-title').value;
  const bookWriter = document.querySelector('#book-writer').value;
  const bookYear = document.querySelector('#book-year').value;

  const generatedId = generateId();
  const bookData = generateBookData(generatedId, bookTitle, bookWriter, bookYear, false);
  books.push(bookData);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const generateId = () => {
  return +new Date();
};

const generateBookData = (id, title, writer, year, isFinished) => {
  return {
    id,
    title,
    writer,
    year,
    isFinished,
  };
};

const books = [];
const RENDER_EVENT = '';

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBooks = document.querySelector('#unfinished-books');
  unfinishedBooks.innerHTML = '';

  const finishedBooks = document.querySelector('#finished-books');
  finishedBooks.innerHTML = '';

  const searchResult = document.querySelector('#result');
  searchResult.innerHTML = '';

  for (const book of books) {
    const newElement = makeBook(book);
    if (!book.isFinished) {
      unfinishedBooks.append(newElement);
    } else {
      finishedBooks.append(newElement);
    }
  }
});

const makeBook = (bookData) => {
  const title = document.createElement('h4');
  title.innerHTML = `<span>Title :</span> ${bookData.title}`;

  const writer = document.createElement('p');
  writer.innerHTML = `<span>Writer :</span> ${bookData.writer}`;

  const year = document.createElement('p');
  year.classList.add('bookYear');
  year.innerHTML = `<span>Year Release :</span> ${bookData.year}`;

  const buttonCollection = document.createElement('div');
  buttonCollection.classList.add('button-items');

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove');
  removeButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

  removeButton.addEventListener('click', () => {
    removeBook(bookData.id);
  });

  buttonCollection.append(removeButton);

  const listItem = document.createElement('li');
  listItem.classList.add('item');
  listItem.append(title, writer, year, buttonCollection);
  listItem.setAttribute('id', `book-${bookData.id}`);

  if (bookData.isFinished) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo');
    undoButton.innerHTML = `<i class="fa-solid fa-rotate-left">`;

    undoButton.addEventListener('click', () => {
      undoBookFromFinished(bookData.id);
    });

    buttonCollection.prepend(undoButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('undo');
    checkButton.innerHTML = `</i><i class="fa-solid fa-check"></i>`;

    checkButton.addEventListener('click', () => {
      addBookToFinished(bookData.id);
    });

    buttonCollection.prepend(checkButton);
  }

  return listItem;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isFinished = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const undoBookFromFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isFinished = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const removeBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findBookIndex = (bookId) => {
  if (this.books === undefined) {
    return;
  }
  for (const book of books) {
    if (books[book].id === bookId) {
      return book;
    }
  }
  return -1;
};

const findBook = (bookId) => {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const SAVED_EVENT = '';
const STORAGE_KEY = 'BooksData';

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
};

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let datas = JSON.parse(serializedData);

  if (datas !== null) {
    for (const data of datas) {
      books.push(data);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const inputPage = () => {
  const inputForm = document.querySelector('.input-form');
  const bookList = document.querySelector('.books-list');
  const bookList2 = document.querySelector('.second');
  const searchSection = document.querySelector('.search-results');
  const bookSection = document.querySelector('.books');

  const refreshButton = document.querySelector('#refresh-button');
  refreshButton.addEventListener('click', (event) => {
    inputForm.classList.remove('display-none');
    bookList.classList.add('display-none');
    bookList2.classList.add('display-none');
    searchSection.classList.add('display-none');
    bookSection.classList.remove('display-none');
    event.preventDefault();
  });
};

const homePage = () => {
  const inputForm = document.querySelector('.input-form');
  const bookList = document.querySelector('.books-list');
  const bookList2 = document.querySelector('.second');
  const searchSection = document.querySelector('.search-results');
  const bookSection = document.querySelector('.books');

  const refreshButton = document.querySelector('#home-button');
  refreshButton.addEventListener('click', (event) => {
    inputForm.classList.add('display-none');
    bookList.classList.remove('display-none');
    bookList2.classList.remove('display-none');
    searchSection.classList.add('display-none');
    bookSection.classList.remove('display-none');
    event.preventDefault();
  });
};

homePage();
inputPage();
