module.exports = (req, res) => {
  const country = (req.headers['x-vercel-ip-country'] || '').toString().toUpperCase();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ country: /^[A-Z]{2}$/.test(country) ? country : null });
};
