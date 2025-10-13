import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import API from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = () => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await API.get(
                `/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
      <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
  }
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <h1 className="home-hero__title">Discover tech that elevates everyday</h1>
          <p className="home-hero__subtitle">
            Curated gadgets and lifestyle products. Switch themes, explore categories, and add favourites to your cart instantly.
          </p>
        </div>
        <div className="home-hero__cta">
          <Link to="/cart" className="hero-cart-link">
            <FiShoppingCart /> View Cart
          </Link>
        </div>
      </section>

      <div className="grid product-grid">
        {products.length === 0 ? (
          <h2 className="product-grid__empty">No Products Available</h2>
        ) : (
          products.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            return (
              <article
                className={`product-card ${productAvailable ? "product-card--active" : "product-card--inactive"}`}
                key={id}
              >
                <Link to={`/product/${id}`} className="product-card__link">
                  <div className="product-card__media">
                    <img src={imageUrl} alt={name} loading="lazy" />
                    {!productAvailable && <span className="product-card__badge">Out of stock</span>}
                  </div>
                  <div className="product-card__body">
                    <div className="product-card__text">
                      <h3 className="product-card__title">{name}</h3>
                      <span className="product-card__brand">{brand}</span>
                    </div>
                    <div className="product-card__meta">
                      <span className="product-card__price">₹{price}</span>
                      <button
                        className="product-card__cta"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        disabled={!productAvailable}
                      >
                        <FiShoppingCart />
                        <span>{productAvailable ? "Add" : "Unavailable"}</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
