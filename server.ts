import app from "./src/app";

app.listen(process.env.APP_PORT, () => {
    console.log(`Server berjalan di http://localhost:${process.env.APP_PORT}`);
  });