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

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Product name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Product name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                    />
                    <small className="form-helper-text">
                      Keep the name concise and descriptive.
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Brand</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Brand"
                      name="brand"
                      value={product.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control form-control-lg"
                      placeholder="Highlight key features, warranty or updates"
                      name="description"
                      rows="3"
                      value={product.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Price (INR)</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text price-prefix">
                        <BiRupee size={18} />
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter price in INR"
                        name="price"
                        value={product.price}
                        min="0"
                        step="0.01"
                        onChange={handleInputChange}
                      />
                    </div>
                    <small className="form-helper-text">
                      Displayed in ₹ for shoppers.
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select form-select-lg"
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select category</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Headphone">Headphone</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Toys">Toys</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Stock quantity</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="Units available"
                      name="stockQuantity"
                      value={product.stockQuantity}
                      min="0"
                      step="1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Release date</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="releaseDate"
                      value={product.releaseDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Product image</label>
                    <input
                      className="form-control form-control-lg"
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                    />
                    <small className="form-helper-text">
                      Recommended ratio 1:1 or 4:5.
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Preview</label>
                    <div className="update-image-preview">
                      {image ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt={product.name || "Product preview"}
                        />
                      ) : (
                        <div className="image-placeholder">Image unavailable</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch form-switch-lg">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="addAvailability"
                        checked={product.productAvailable}
                        onChange={(e) =>
                          setProduct({ ...product, productAvailable: e.target.checked })
                        }
                      />
                      <label className="form-check-label ms-2" htmlFor="addAvailability">
                        Product available for purchase
                      </label>
                    </div>
                  </div>

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
