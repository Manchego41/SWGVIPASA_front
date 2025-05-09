import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} IPASA. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;