import '../css/app.css';

import { createRoot } from 'react-dom/client';
import Portfolio from './pages/portfolio';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Root element not found.');
}

createRoot(root).render(<Portfolio />);
