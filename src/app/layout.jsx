import './globals.css';
import FPSMeter from '../components/FPSMeter';

export const metadata = {
  title: 'Ethereal Studio',
  description: 'A spatial laboratory where design transcends the browser window.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;500;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/30">
        <FPSMeter />
        {children}
      </body>
    </html>
  );
}
