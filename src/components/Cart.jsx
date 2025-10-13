// import React, { useContext, useState, useEffect } from "react";
// // import axios from '../axios';
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from "react-bootstrap";
// const Cart = () => {
//   const { cart, removeFromCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [cartImage, setCartImage] =useState([])
//   const [showModal, setShowModal] = useState(false);
  
//   // useEffect(() => {
//   //   const fetchImagesAndUpdateCart = async () => {
//   //     console.log("Cart", cart);
//   //     const updatedCartItems = await Promise.all(
//   //       cart.map(async (item) => {
//   //         console.log("ITEM",item)
//   //         try {
//   //           const response = await axios.get(
//   //             `http://localhost:8080/api/product/${item.id}/image`,
//   //             { responseType: "blob" }
//   //           );
//             // const imageFile = await converUrlToFile(response.data,response.data.imageName)
//   //           setCartImage(imageFile);
//   //           const imageUrl = URL.createObjectURL(response.data);
//   //           return { ...item, imageUrl, available: true };
//   //         } catch (error) {
//   //           console.error("Error fetching image:", error);
//   //           return { ...item, imageUrl: "placeholder-image-url", available: false };
//   //         }
//   //       })
//   //     );
//   //     const filteredCartItems = updatedCartItems.filter((item) => item.available);
//   //     setCartItems(updatedCartItems);
     
//   //   };

//   //   if (cart.length) {
//   //     fetchImagesAndUpdateCart();
//   //   }
//   // }, [cart]);

//   useEffect(() => {
//     const fetchImagesAndUpdateCart = async () => {
//       try {
    
//         const response = await API.get("/products");
//         const backendProductIds = response.data.map((product) => product.id);

//         const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
//         const cartItemsWithImages = await Promise.all(
//           updatedCartItems.map(async (item) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${item.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageFile = await converUrlToFile(response.data, response.data.imageName);
//               setCartImage(imageFile)
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...item, imageUrl };
//             } catch (error) {
//               console.error("Error fetching image:", error);
//               return { ...item, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );

//         setCartItems(cartItemsWithImages);
//       } catch (error) {
//         console.error("Error fetching product data:", error);
    
//       }
//     };

//     if (cart.length) {
//       fetchImagesAndUpdateCart();
//     }
//   }, [cart]);
  


//   useEffect(() => {
//     console.log("CartItems", cartItems);
//   }, [cartItems]);
//   const converUrlToFile = async(blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

 
//   const handleIncreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCartItems(newCartItems);
//   };
//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//     const newCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
//         const updatedStockQuantity = item.stockQuantity - item.quantity;
  
//         const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
//         console.log("updated product data", updatedProductData)
  
//         const cartProduct = new FormData();
//         cartProduct.append("imageFile", cartImage);
//         cartProduct.append(
//           "product",
//           new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
//         );
  
//         await axios
//           .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Product updated successfully:", (cartProduct));
            
//           })
//           .catch((error) => {
//             console.error("Error updating product:", error);
//           });
//       }
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.log("error during checkout", error);
//     }
//   };
  
//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.id}
//                 >
//                   <div className="buttons">
//                     <div className="buttons-liked">
//                       <i className="bi bi-heart"></i>
//                     </div>
//                   </div>
//                   <div>
//                     <img
//                       // src={cartImage ? URL.createObjectURL(cartImage) : "Image unavailable"}
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleIncreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       name="name"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       name="button"
//                       // style={{ backgroundColor: "white" }}
//                       onClick={() => handleDecreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price " style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={handleCheckout}
//             >
//               Checkout
//             </button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>

//   );
// };

// export default Cart;





import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import API from "../axios";
import { BiCheckCircle } from "react-icons/bi";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImages, setCartImages] = useState({});
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertBlobToFile = async (blobData, fileName) => {
    const extension = blobData.type?.split("/")[1] || "jpg";
    const safeName = fileName.includes(".") ? fileName : `${fileName}.${extension}`;
    return new File([blobData], safeName, { type: blobData.type || "image/jpeg" });
  };

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await API.get("/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart
          .filter((item) => backendProductIds.includes(item.id))
          .map((item) => ({ ...item, quantity: item.quantity || 1 }));

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const imageResponse = await API.get(
                `/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const fileName = item.imageName || `product-${item.id}`;
              const imageFile = await convertBlobToFile(
                imageResponse.data,
                fileName
              );
              const imageUrl = URL.createObjectURL(imageResponse.data);
              setCartImages((prev) => ({ ...prev, [item.id]: imageFile }));
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return {
                ...item,
                imageUrl: "https://via.placeholder.com/120?text=Product",
              };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    if (!showOrderSuccess) return;
    const timer = setTimeout(() => setShowOrderSuccess(false), 2600);
    return () => clearTimeout(timer);
  }, [showOrderSuccess]);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (item.quantity < item.stockQuantity) {
            return { ...item, quantity: item.quantity + 1 };
          }
          alert("Cannot add more than available stock");
        }
        return item;
      })
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setIsProcessing(true);
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        const imageFile = cartImages[item.id];
        if (imageFile) {
          cartProduct.append("imageFile", imageFile);
        }
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          })
        );

        await API.put(`/product/${item.id}`, cartProduct, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      clearCart();
      setCartItems([]);
      setShowOrderSuccess(true);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error during checkout", error);
      alert("Something went wrong while processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="container cart-layout">
        <div className="cart-main-card">
          <div className="cart-header">
            <div>
              <h2 className="mb-1">Shopping Bag</h2>
              <p className="mb-0 cart-header-sub">Review items before checkout.</p>
            </div>
            <span className="cart-count-pill">{cartItems.length} items</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <p className="cart-empty-title">Your cart is empty</p>
              <span className="cart-empty-text">Add products to continue shopping.</span>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-line-card" key={item.id}>
                  <div className="cart-line-media">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="cart-line-info">
                    <div className="cart-line-top">
                      <div>
                        <p className="cart-line-category">{item.category}</p>
                        <h5 className="cart-line-title">{item.name}</h5>
                        <span className="cart-line-brand">{item.brand}</span>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-line-footer">
                      <div className="quantity-controller">
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-line-price">
                        <span>{currencyFormatter.format(item.price * item.quantity)}</span>
                        <small>₹{Number(item.price).toLocaleString("en-IN")}/unit</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="cart-summary-card">
          <h4 className="mb-3">Order summary</h4>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{currencyFormatter.format(totalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="shipping-chip">Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{currencyFormatter.format(totalPrice)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg w-100"
            onClick={handleCheckout}
            disabled={!cartItems.length || isProcessing}
          >
            {isProcessing ? "Placing order..." : "Checkout"}
          </button>
        </aside>
      </div>

      {showOrderSuccess && (
        <div className="order-success-overlay">
          <div className="order-success-card">
            <div className="order-success-icon">
              <BiCheckCircle />
            </div>
            <h4 className="mb-2">Order placed successfully</h4>
            <p className="mb-0">Thank you! We'll notify you when your items are on the way.</p>
            <button
              type="button"
              className="btn btn-outline-secondary mt-3"
              onClick={() => setShowOrderSuccess(false)}
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
