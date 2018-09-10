import 'colors';
import compose from './compose';

// Projeyi derlemede kullanılır
let buildProcess = compose();
if (buildProcess) {
  buildProcess.catch((err) => {
    if (err.stack) {
      console.error(err.stack.red);
    } else {
      console.error(err.toString().red);
    }
  });
}