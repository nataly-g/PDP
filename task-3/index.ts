import Library from './library.js';

const library = new Library();

library.add('My Brilliant Friend', 'Elena Ferrante', 2012);

library.add('The Warmth of Other Suns', 'Isabel Wilkerson', 2010);

library.list();

library.search('hobbit');

library.search('ANYWAYS');

library.remove('suns');

library.checkAvailability('Larsson');

library.list();
