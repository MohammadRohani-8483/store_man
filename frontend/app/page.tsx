export default async function Home() {
  const newProduct = {
    name: 'iphone 14',
    price: 10000,
    count: 50
  }

  const newCustomer = {
    name: 'mohammad',
    phoneNumber: '09323632521',
  } 

  const newOrder = { products: [{ id: "664469cc9a91355259c94257", quantity: 1 }], customerId: "66470f6c2f0a69b126f1ae21" }

  const configOrder = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newOrder)
  }

  const configProduct = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct)
  }

  const configCustomer = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCustomer)
  }

  // try {
  //   const res = await fetch('http://localhost:5555/orders', configOrder)
  //   const data = await res.json()
  //   console.log('data =>', data);
  // } catch (err) {
  //   console.log('error =>', err);
  // }

  try {
    const res = await fetch('http://localhost:5555/products', configProduct)
    const data = await res.json()
    console.log('data =>', data);
  } catch (err) {
    console.log('error =>', err);
  }

  // try {
  //   const res = await fetch('http://localhost:5555/customers', configCustomer)
  //   const data = await res.json()
  //   console.log('data =>', data);
  // } catch (err) {
  //   console.log('error =>', err);
  // }

  return (
    <main></main>
  );
}
