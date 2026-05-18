import './globals.css';
import FPSMeter from '../components/FPSMeter';

export const metadata = {
  title: 'Ethereal Studio',
  description: 'A spatial laboratory where design transcends the browser window.',
};

// Silence irritating terminal warnings
if (typeof window !== 'undefined') {
  const originalLog = console.log;
  const originalWarn = console.warn;
  
  const isTheatreWarning = (args) => 
    args[0] && typeof args[0] === 'string' && (
      args[0].includes('Theatre.js Studio is hidden') || 
      args[0].includes('studio.ui.restore')
    );

  console.log = (...args) => {
    if (isTheatreWarning(args)) return;
    originalLog(...args);
  };

  console.warn = (...args) => {
    if (isTheatreWarning(args)) return;
    originalWarn(...args);
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;500;700;800&family=Inter:wght@400;500&family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/30">
        <FPSMeter />
        {children}
      </body>
    </html>
  );
}
