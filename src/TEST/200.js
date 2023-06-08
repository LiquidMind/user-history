function processCSV(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv({ headers: ["key", "value"] }))
    .on("data", (data) => {
      const key = data.key.trim();
      const value = data.value.trim();
      const obj = {};
      obj[key] = value;
      results.push(obj);
    })
    .on("end", () => {
      console.log(results);
    })
    .on("error", (error) => {
      console.error("Error in processCSV:", error);
    });
}