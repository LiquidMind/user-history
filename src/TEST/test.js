// function getRandomDatesOrNull(start) {
//   // Отримуємо поточну дату
//   const end = new Date();

//   // Вибираємо випадкову дату для publishedAfter та publishedBefore
//   let publishedAfter = new Date(
//     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//   );
//   let publishedBefore = new Date(
//     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//   );

//   // Переконуємося, що publishedAfter < publishedBefore
//   if (publishedAfter > publishedBefore) {
//     [publishedAfter, publishedBefore] = [publishedBefore, publishedAfter];
//   }

//   return [publishedAfter.toISOString(), publishedBefore.toISOString()];
// }

// // Використання:
// const dates = getRandomDatesOrNull(new Date("2005-04-23"));
// console.log(`publishedAfter: ${dates[0]}`);
// console.log(`publishedBefore: ${dates[1]}`);

function getRandomDatesOrNull(start) {
  const end = new Date();

  let publishedAfter = null;
  let publishedBefore = null;

  // Генеруємо випадкову дату для publishedAfter, якщо не null
  if (Math.random() < 0.5) {
    publishedAfter = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  // Генеруємо випадкову дату для publishedBefore, якщо не null
  if (Math.random() < 0.5) {
    publishedBefore = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  // Якщо обидві дати випадкові, переконуємося, що publishedAfter < publishedBefore
  if (publishedAfter && publishedBefore && publishedAfter > publishedBefore) {
    [publishedAfter, publishedBefore] = [publishedBefore, publishedAfter];
  }

  return [publishedAfter, publishedBefore];
}
const dates = getRandomDatesOrNull(new Date("2005-04-23"));
console.log(`publishedAfter: ${dates[0] ? dates[0].toISOString() : null}`);
console.log(`publishedBefore: ${dates[1] ? dates[1].toISOString() : null}`);
