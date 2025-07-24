import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import { testConnection } from './controllers/itemRepository';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Sirve archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

testConnection();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});