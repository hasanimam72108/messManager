const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        &copy; {currentYear} All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
