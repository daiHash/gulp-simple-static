'use strict';

const logger = (word = 'Hi,') => {
  console.log(word, '🤨!!!');
  console.log(process.env.FTP_USER);
  
}

logger();