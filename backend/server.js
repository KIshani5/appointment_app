// env vars
require('dotenv').config();
// express
const app=require('./src/app');

// 3000!1!
const PORT=process.env.PORT||3000;

app.listen(PORT,()=> {
  console.log(`Server running http://localhost:${PORT}`);
});