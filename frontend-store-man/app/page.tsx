export default async function Home() {
  const newProduct = {
    name: 'teblet',
    price: 2000,
    count: 80
  }
  const config = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct)
  }
  try {
    const res = await fetch('http://localhost:5555/products', config)
    const data = await res.json()
    console.log('data =>', data);
  } catch (err) {
    console.log('error =>', err);
  }
  return (
    <main></main>
  );
}
