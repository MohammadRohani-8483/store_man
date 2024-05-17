export default async function Home() {
  const newProduct = {
    name: 'teblet',
    price: 2000,
    count: 80
  }
  const newOrder = { products: [{ id: "664469514c1aaed055ef5e46", quantity: 1 }] }
  const config = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newOrder)
  }
  try {
    const res = await fetch('http://localhost:5555/orders', config)
    const data = await res.json()
    console.log('data =>', data);
  } catch (err) {
    console.log('error =>', err);
  }
  // try {
  //   const res = await fetch('http://localhost:5555/products', config)
  //   const data = await res.json()
  //   console.log('data =>', data);
  // } catch (err) {
  //   console.log('error =>', err);
  // }
  return (
    <main></main>
  );
}
