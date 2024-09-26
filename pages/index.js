import { useState} from "react";
import Product from "../components/Product";
import {initMongoose} from "../lib/mongoose";
import {findAllProducts} from "./api/products";
import Layout from "../components/Layout";

export default function Home({products}) {
  const [phrase,setPhrase] = useState('');

  const categoriesNames = [...new Set(products.map(p => p.category))];

  if (phrase) {
    products = products.filter(p => p.name.toLowerCase().includes(phrase));
  }

  return (
    <Layout>
      <input value={phrase} onChange={e => setPhrase(e.target.value)} type="text" placeholder="Search for products..." className="bg-gray-200 w-full py-4 px-6 rounded-xl color-black"/>
      <div>
        {categoriesNames.map(categoryName => (
          <div key={categoryName}>
            {products.find(p => p.category === categoryName) && (
              <div>
                <h2 className="text-4xl py-5 capitalize">{categoryName}</h2>
                <div className="flex -mx-5 l snap-x">
                  {products.filter(p => p.category === categoryName).map(productInfo => (
                    <div key={productInfo._id} className="px-5 snap-start">
                      <Product {...productInfo} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </Layout>
  )
}

export async function getServerSideProps() {
  await initMongoose();
  const products = await findAllProducts();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
