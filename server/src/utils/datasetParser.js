import xlsx from 'xlsx';

const splitList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return String(value)
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeRating = (value) => {
  const rating = Number(value ?? 0);

  if (Number.isNaN(rating)) {
    return 0;
  }

  return Math.min(Math.max(rating, 0), 5);
};

const getFirstValue = (row, aliases) => {
  const entry = Object.entries(row).find(([key]) => aliases.includes(key.trim().toLowerCase()));
  return entry ? entry[1] : '';
};

export const parseBooksDataset = (buffer, filename) => {
  const workbook = xlsx.read(buffer, {
    type: 'buffer',
    raw: false
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('The uploaded file does not contain any sheets');
  }

  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    defval: ''
  });

  if (!rows.length) {
    throw new Error('The uploaded file does not contain any data rows');
  }

  const books = rows.map((row, index) => {
    const title = String(getFirstValue(row, ['title', 'book title'])).trim();
    const author = String(getFirstValue(row, ['author', 'authors', 'writer'])).trim();
    const genres = splitList(getFirstValue(row, ['genres', 'genre', 'categories']));
    const keywords = splitList(getFirstValue(row, ['keywords', 'keyword', 'tags']));
    const average_rating = normalizeRating(
      getFirstValue(row, ['average_rating', 'average rating', 'rating'])
    );
    const coverImage = String(
      getFirstValue(row, ['coverimage', 'cover image', 'image', 'imageurl', 'image url'])
    ).trim();
    const description = String(getFirstValue(row, ['description', 'summary', 'overview'])).trim();

    if (!title || !author) {
      throw new Error(`Row ${index + 2} in ${filename} is missing a required title or author`);
    }

    return {
      title,
      author,
      genres,
      keywords,
      average_rating,
      coverImage,
      description
    };
  });

  return books;
};
