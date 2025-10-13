import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../axios";
import { BiCheckCircle, BiRupee } from "react-icons/bi";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);

        setProduct(response.data);
      
        const responseImage = await API.get(
          `/product/${id}/image`,
          { responseType: "blob" }
        );
       const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
        setImage(imageFile);     
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);



  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("images", image)
    console.log("productsdfsfsf", updateProduct)
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );
  

  console.log("formData : ", updatedProduct)
    API
      .put(`/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", response.data);
        setShowSuccess(true);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        console.log("product unsuccessfull update",updateProduct)
        alert("Failed to update product. Please try again.");
      });
  };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
                    <h2 className="mb-1">Update product details</h2>
                    <p className="add-product-subtitle mb-0">Refresh the listing with the latest information and pricing.</p>
                  </div>
                </div>
                <form className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Product name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Product name"
                      value={updateProduct.name}
                      onChange={handleChange}
                      name="name"
                    />
                    <small className="form-helper-text">Keep the name concise and descriptive.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control form-control-lg"
                      placeholder="Brand"
                      value={updateProduct.brand}
                      onChange={handleChange}
                      id="brand"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control form-control-lg"
                      placeholder="Highlight the latest features, warranty or updates"
                      name="description"
                      onChange={handleChange}
                      value={updateProduct.description}
                      id="description"
                      rows="3"
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
                        onChange={handleChange}
                        value={updateProduct.price}
                        placeholder="Enter price in INR"
                        name="price"
                        id="price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <small className="form-helper-text">Displayed in ₹ for shoppers.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select form-select-lg"
                      value={updateProduct.category}
                      onChange={handleChange}
                      name="category"
                      id="category"
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
                      onChange={handleChange}
                      placeholder="Units available"
                      value={updateProduct.stockQuantity}
                      name="stockQuantity"
                      id="stockQuantity"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Release date</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      value={updateProduct.releaseDate}
                      name="releaseDate"
                      onChange={handleChange}
                      id="releaseDate"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Product image</label>
                    <input
                      className="form-control form-control-lg"
                      type="file"
                      onChange={handleImageChange}
                      placeholder="Upload image"
                      name="imageUrl"
                      id="imageUrl"
                    />
                    <small className="form-helper-text">Recommended ratio 1:1 or 4:5.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Preview</label>
                    <div className="update-image-preview">
                      {image ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt={product.imageName || "Product preview"}
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
                        name="productAvailable"
                        id="updateAvailability"
                        checked={updateProduct.productAvailable}
                        onChange={(e) =>
                          setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                        }
                      />
                      <label className="form-check-label ms-2" htmlFor="updateAvailability">
                        Product available for purchase
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                      <div className="add-product-meta">
                        <span className="badge rounded-pill availability-badge">
                          {updateProduct.productAvailable ? "Live" : "Draft"}
                        </span>
                        <span className="ms-2 meta-info">Changes are reflected instantly after publishing.</span>
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg px-4">
                        Save updates
                      </button>
                    </div>
                  </div>
                </form>
              </div>
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
            <h4 className="mb-2">Product updated successfully</h4>
            <p className="mb-0">The listing now shows your latest details.</p>
            <div className="success-modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(`/product/${id}`);
                }}
              >
                View product page
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowSuccess(false)}
              >
                Continue editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;