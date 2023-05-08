const fs = require("fs");

// читаємо текстовий файл
fs.readFile("b.txt", "utf-8", (err, data) => {
  if (err) throw err;

  // перетворюємо дані у JSON формат
  const jsonData = JSON.stringify(data);

  // виводимо JSON дані у консоль
  // розділяємо стрічку на підрядки з використанням коми (',') як роздільника
  const parts = jsonData.split(",");

  // ініціалізуємо порожній об'єкт JSON
  const obj = {};

  // застосовуємо регулярний вираз до кожного підрядка та додаємо отримані значення до об'єкту JSON
  for (let i = 0; i < parts.length; i++) {
    const matches = parts[i].match(/([^:]*):(.*)/);
    if (matches) {
      const key = matches[1];
      const value = parseInt(matches[2]);
      obj[key] = value;
    }
  }

  // перетворюємо об'єкт JSON у стрічку з використанням JSON.stringify()
  const jsonString = JSON.stringify(obj);
  const a = JSON.parse(jsonString);
  console.log(Object.keys(a));
  console.log(` ДОВЖИНА: ${Object.keys(a).length}`);
});
