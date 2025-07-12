import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT ?? '5001', 10);
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));