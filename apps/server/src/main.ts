import mongoose from 'mongoose';
import App from './app/App';

const port = process.env.PORT || 3333;

function main() {
  mongoose
    .connect(process.env.DB_URL, {})
    .then(() => console.info('DB connected'))
    .catch((err) => console.error('DB Error => ', err));

  App.listen(port, () => {
    console.info(`Listening at http://localhost:${port}`);
  }).on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
