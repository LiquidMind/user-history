const address = "first_user";
const user_name = address.replace(/[@.]/g, "");

console.log(user_name);

const arrHistory = [
  {
    header: "YouTube",
    title: "Ви дивилися відео ISACA Career Fundamentals",
    titleUrl: "https://www.youtube.com/watch?v\u003d___lVbYXor8",
    description: "Переглянуто о 16:49",
    time: "2023-01-26T14:49:47.721Z",
    products: ["YouTube"],
    details: [
      {
        name: "Від Реклами Google",
      },
    ],
    activityControls: [
      "Історія додатків і веб-пошуку",
      "Історія переглядів YouTube",
      "Історія пошуку YouTube",
    ],
  },
];

module.exports = { arrHistory, user_name };
