import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiCheckCircle, BiRupee } from "react-icons/bi";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const requiredFields = [
      "name",
      "brand",
      "description",
      "price",
      "category",
      "stockQuantity",
      "releaseDate",
    ];
    const missing = requiredFields.filter((f) => !String(product[f] ?? "").trim());
    if (missing.length > 0) {
      alert(`Please fill all required fields: ${missing.join(", ")}`);
      return;
    }
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob(
        [
          JSON.stringify({
            ...product,
            price: Number(product.price),
            stockQuantity: Number(product.stockQuantity),
          }),
        ],
        { type: "application/json" }
      )
    );

    const token = localStorage.getItem("token"); // ✅ Get JWT token

    axios
      .post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Send token to backend
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          releaseDate: "",
          productAvailable: false,
        });
        setImage(null);
        setShowSuccess(true);
      })
      .catch((error) => {
        console.error("Error adding product:", error?.response?.data || error.message);
        alert("Error adding product. Please check the fields and try again.");
        setShowSuccess(false);
      });
  };

  return (
    <div className="add-product-page">
      <div className="center-container container">
        <div className="add-product-wrapper row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card add-product-card border-0">
              <div className="card-body p-4 p-lg-5">
                <div className="add-product-header mb-4">
                  <div>
                    <h2 className="mb-1">Add a New Product</h2>
                    <p className="add-product-subtitle mb-0">
                      Create a compelling listing to reach more shoppers.
                    </p>
                  </div>
                </div>

                {/* ✅ FORM START */}
                <form className="row g-4" onSubmit={submitHandler}>
                  {/* Product fields same as before */}
                  {/* ... your existing input fields ... */}

                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                      <div className="add-product-meta">
                        <span className="badge rounded-pill availability-badge">
                          {product.productAvailable ? "Live" : "Draft"}
                        </span>
                        <span className="ms-2 meta-info">
                          All prices are shown in INR.
                        </span>
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg px-4">
                        Publish product
                      </button>
                    </div>
                  </div>
                </form>
                {/* ✅ FORM END */}
              </div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="success-modal-overlay">
            <div className="success-modal-card">
              <div className="success-modal-icon">
                <BiCheckCircle />
              </div>
              <h4 className="mb-2">Product added successfully</h4>
              <p className="mb-0">Your new product is now live in the catalogue.</p>
              <div className="success-modal-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowSuccess(false);
                    navigate("/");
                  }}
                >
                  View catalogue
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowSuccess(false)}
                >
                  Add another product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
