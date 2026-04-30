export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ error: "Provide a number" });
  }

  const n = parseInt(number);

  function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  // Simulated parallel chunks
  const chunkSize = Math.ceil(n / 4);

  const tasks = Array.from({ length: 4 }, (_, i) => {
    const start = i * chunkSize + 1;
    const end = Math.min((i + 1) * chunkSize, n);

    return new Promise((resolve) => {
      let primes = [];
      for (let j = start; j <= end; j++) {
        if (isPrime(j)) primes.push(j);
      }
      resolve(primes);
    });
  });

  const results = await Promise.all(tasks);

  res.status(200).json({
    number: n,
    primes: results.flat(),
  });
}
