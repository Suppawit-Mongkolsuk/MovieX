import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {/* ToastContainer อยู่ระดับ root */}
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />

    {/*  ตัว Router ของ MOVIX */}
    <AppRouter />
  </>
);
