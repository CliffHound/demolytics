import './globals.css';

export const metadata = {
  title: 'Demolytics',
  description: 'Convert commercial building blueprints into demolition Statements of Work',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
