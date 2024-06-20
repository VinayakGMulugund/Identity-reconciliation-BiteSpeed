import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { sequel } from './config/postgres';
import { ContactService, getAll } from './service/contact';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/identify', ContactService);
app.get('', getAll)


sequel.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
