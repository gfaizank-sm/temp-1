"use client";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {
  Button,
  Paper,
  Typography,
  CardContent,
  List,
  StyledRating,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PharmacyHeader from "@/components/pharmacy/header";
import FooterCart from "@/components/pharmacy/footer-cart";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import ProductSlider from "@/components/pharmacy/productSlider";
import HelpIcon from "@mui/icons-material/Help";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { GetPharmacyCart } from "@/api_calls/pharmacy/GetPharmacyCart";
import { GetAddToCartProducts } from "@/api_calls/pharmacy/GetAddToCartProducts";
import { styled } from "@mui/material/styles";
import { GetPharmacyProductDetails } from "@/api_calls/pharmacy/GetPharmacyProductDetails";
import { emptyCart } from "@/api_calls/pharmacy/RemoveCartItem";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { product_review_submit } from "@/api_calls/pharmacy/product_review";
import Snackbar from "@mui/material/Snackbar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { GetPharmacyProductWishlist } from "@/api_calls/pharmacy/GetPharmacyProductWishlist";

export default (props) => {
  const Swal = require("sweetalert2");
  const { push } = useRouter();
  const [skeleton, setSkeleton] = useState(1);
  const [productId, setProductId] = useState(
    props.params.path[0] ? props.params.path[0] : 0
  );
  const [qty, setQty] = useState(0);
  const [cartItems, setCartItems] = useState(0);
  const [writeReview, setWriteReview] = useState(0);
  const [productDetails, setProductDetails] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [topDealProducts, setTopDealProducts] = useState([]);
  const [cartProductItem, setCartProductItem] = useState([]);
  const [userId, setUserId] = useState(null);
  const [rateValue, setRateValue] = useState({ star: 4, msg: "" });
  const [fav, setFav] = useState(0);

  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));

  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon fontSize="16px" color="error" />,
      label: "Very Dissatisfied",
    },
    2: {
      icon: <SentimentDissatisfiedIcon fontSize="16px" color="error" />,
      label: "Dissatisfied",
    },
    3: {
      icon: <SentimentSatisfiedIcon fontSize="16px" color="warning" />,
      label: "Neutral",
    },
    4: {
      icon: <SentimentSatisfiedAltIcon fontSize="16px" color="success" />,
      label: "Satisfied",
    },
    5: {
      icon: <SentimentVerySatisfiedIcon fontSize="16px" color="success" />,
      label: "Very Satisfied",
    },
  };

  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  const removeFromCart = () => {
    if (Number(qty) > 0) {
      setQty(Number(qty) - 1);
      setCartItems(Number(cartItems) - 1);
      GetAddToCartProducts(productDetails.product_id, Number(qty) - 1);
    }
  };

  const clearCart = async () => {
    await emptyCart();
    setCartItems(0);
    setCartProductItem([]);
  };

  const addToCart = () => {
    if (cartProductItem.length > 0) {
      let cartVendorId = cartProductItem[0].vendor_id;
      if (cartVendorId != productDetails.vendor_id) {
        Swal.fire({
          title: "View Cart",
          text: "There is an item of different vendor in your cart!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#000000cc",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Clear Cart",
          cancelButtonText: "View Cart",
        })
          .then((result) => {
            if (result.isConfirmed) {
              clearCart();
              Swal.fire({
                title: "Product added succesfully in the cart",
                text: "Product added succesfully in the cart",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#000000cc",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Go to Cart",
                cancelButtonText: "Continue",
              })
                .then((result) => {
                  if (result.isConfirmed) {
                    setQty(Number(qty) + 1);
                    setCartItems(Number(cartItems) + 1);
                    GetAddToCartProducts(
                      productDetails.product_id,
                      Number(qty) + 1
                    );
                    push("/pharmacy/cart");
                  } else {
                    push("/pharmacy");
                  }
                })
                .catch((error) => {
                  console.log(error);
                  //return { status: 0, msg: error.message };
                });
            } else {
              push("/pharmacy/cart");
            }
          })
          .catch((error) => {
            console.log(error);
            //return { status: 0, msg: error.message };
          });
        return false;
      }
    }
    setQty(Number(qty) + 1);
    setCartItems(Number(cartItems) + 1);
    GetAddToCartProducts(productDetails.product_id, Number(qty) + 1);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("application_user")).temp_user_id) {
      setUserId(
        JSON.parse(localStorage.getItem("application_user")).temp_user_id
      );
    }
    async function check() {
      await GetPharmacyCart()
        .then((res) => {
          if (false) {
          } else {
            setCartProductItem(
              res.carts.map((item) => ({
                cart_quantity: `${item.cart_quantity}`,
                cart_id: `${item.cart_id}`,
                cart_product_name: `${item.product_detail.product_name}`,
                product_id: `${item.product_detail.product_id}`,
                src: `${process.env.NEXT_PUBLIC_APP_URL}${item.product_detail.image_path}`,
                price: `${item.product_detail.price}`,
                qty: `${item.cart_quantity}`,
                vendor_id: `${res.vendor_id}`,
                vendor_name: `${res.vendor_name}`,
              }))
            );
            setCartItems(Number(res.total_qty));
          }
        })
        .catch((error) => {
          console.log(error);
          //return { status: 0, msg: error.message };
        });
      await GetPharmacyProductDetails(productId)
        .then((res) => {
          if (false) {
          } else {
            setProductDetails(res.product);
            setFav(res.product.wishlist);
            setSimilarProducts(res.similarProducts);
            setTopDealProducts(res.topDealProducts);
            setQty(res.product.cart_quantity);
          }
        })
        .catch((error) => {
          console.log(error);
          //return { status: 0, msg: error.message };
        });
      setSkeleton(0);
    }
    check();
  }, []);

  //API call
  async function checkForWishlist(open = 0) {
    await GetPharmacyProductWishlist(
      productDetails.product_id ? productDetails.product_id : 0,
      open ? 0 : 1
    ).then((res) => {
      if (false) {
      } else {
        if (res.status) {
          setSnack({
            open: true,
            message: res.msg,
          });
        }
      }
    });
  }

  const handleWishlist = async (e, open) => {
    e.preventDefault();
    setFav(open);
    await checkForWishlist(open);
  };

  const submitReview = async () => {
    await product_review_submit(productId, rateValue.star, rateValue.msg);
    setWriteReview(0);
    setSnack({
      open: true,
      message: "Thank You, Review submitted for this Product.",
    });
  };

  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });
  const snackClose = () => {
    setSnack({
      open: false,
      message: "",
    });
  };

  return (
    <>
      <PharmacyHeader
        cart_items={cartItems}
        href="/pharmacy/products"
        title={productDetails.product_name}
      />
      <br />
      {skeleton == 1 ? (
        showSkeleton()
      ) : (
        <>
          <Container>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #ccc",
              }}
            >
              <>
                <Box
                  className="d-flex"
                  sx={{
                    background: "#fff",
                    justifyContent: "center",
                    py: 3,
                    position: "relative",
                  }}
                >
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_APP_URL +
                      productDetails.image_path
                    }
                    width={250}
                    height={250}
                    style={{
                      objectFit: "contain",
                    }}
                    alt="secmed-product"
                  />
                  <Box
                    className="d-flex"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        background: "var(--bggreen)",
                        color: "var(--textgreen)",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {productDetails.discount_percent > 0 ? (
                        <Typography
                          fontSize="10px"
                          fontWeight={500}
                          sx={{
                            p: 0.5,
                          }}
                        >
                          {productDetails.discount_percent}% off
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Box>
                    <Box
                      sx={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "0.25rem",
                      }}
                    >
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_APP_URL +
                          productDetails.vendor_logo
                        }
                        width={50}
                        height={20}
                        alt="vendor-logo"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    className="d-flex"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Box sx={{ color: fav == 0 ? "#ccc" : "red", px: 1 }}>
                      {fav == 0 ? (
                        <FavoriteBorderIcon
                          sx={{ width: "28px", height: "28px" }}
                          onClick={(e) => {
                            handleWishlist(e, 1);
                          }}
                        />
                      ) : (
                        <FavoriteIcon
                          sx={{ width: "28px", height: "28px" }}
                          onClick={(e) => {
                            handleWishlist(e, 0);
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
              <Box
                sx={{
                  background: "#eee",
                  color: "#000",
                  p: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontSize="18px"
                  component="h6"
                  color={"#000"}
                >
                  {productDetails.product_name}
                </Typography>
                <Box
                  mt={1}
                  className="d-flex"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontSize="14px"
                    component="h6"
                    sx={{ width: "65%" }}
                  >
                    {productDetails?.brand_name == "null" ||
                    productDetails?.brand_name == "" ||
                    productDetails?.brand_name == null ? (
                      ""
                    ) : (
                      <>
                        Brand: <strong>{productDetails.brand_name}</strong>{" "}
                        <br />
                      </>
                    )}
                    Status:
                    {productDetails.stock == "1" ? (
                      <strong className="text-green">In Stock</strong>
                    ) : (
                      <strong className="text-red">Out Of Stock</strong>
                    )}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontSize="18px"
                    className="lineclamp-1"
                    component="h6"
                  >
                    <strong>₹{productDetails.price} </strong>
                    {productDetails.mrp == 0 &&
                    productDetails.discount_percent > 0 ? (
                      <small>
                        <del>
                          ₹
                          {parseFloat(
                            parseInt(productDetails.price) +
                              parseInt(
                                (productDetails.price *
                                  productDetails.discount_percent) /
                                  100
                              )
                          )}
                        </del>
                      </small>
                    ) : productDetails.mrp == productDetails.price ||
                      productDetails.mrp < productDetails.price ||
                      productDetails?.mrp == "null" ? (
                      ""
                    ) : (
                      <small>
                        <del>₹{productDetails.mrp}</del>{" "}
                      </small>
                    )}
                  </Typography>
                </Box>
                <Box className="d-flex" mt={1}>
                  {productDetails.rx_needed == "1" ? (
                    <>
                      <Image
                        src="/img/rx.png"
                        width={20}
                        height={20}
                        alt="rx"
                      />
                      <Typography ml={1} fontSize={"14px"}>
                        Prescription required on this product.
                      </Typography>
                    </>
                  ) : (
                    <></>
                  )}
                </Box>

                <Box mt={1}>
                  {productDetails.stock == "1" ? (
                    qty > 0 ? (
                      <>
                        <Box
                          className="d-flex"
                          mt={0.5}
                          sx={{
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Button
                            type="button"
                            className="web-btn plus-minus"
                            onClick={removeFromCart}
                            style={{ borderRadius: "5px 0px 0px 5px" }}
                          >
                            <MinusIcon />
                          </Button>
                          <Typography
                            variant="h6"
                            component="p"
                            sx={{
                              background: "#fff",
                              width: "100%",
                              height: "35px",
                              textAlign: "center",
                              border: "1px solid #eee",
                              borderRadius: "0px",
                            }}
                          >
                            {qty}
                          </Typography>
                          <Button
                            type="button"
                            className="web-btn plus-minus"
                            onClick={addToCart}
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                          >
                            <PlusIcon />
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Button
                        fullWidth
                        type="button"
                        className="web-btn add-to-cart"
                        onClick={addToCart}
                      >
                        Add to cart
                      </Button>
                    )
                  ) : (
                    <Button
                      fullWidth
                      type="button"
                      className="web-btn add-to-cart"
                    >
                      Out Of Stock
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
            <Box mt={4}>
              {/* <ProductSlider title={"Products you may like"}/> */}
              {productDetails.vendor_id ? (
                <ProductSlider
                  title={"Products you may like"}
                  setCartProductItem={setCartProductItem}
                  cartProductItem={cartProductItem}
                  cartProducts={props.cartProducts}
                  setCartProducts={props.setCartProducts}
                  vendor_id={productDetails.vendor_id}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  tagName={""}
                />
              ) : (
                ""
              )}
            </Box>
            <Box mt={4}>
              {/* <ProductSlider title={"Top Deals"} /> */}
              {productDetails.vendor_id ? (
                <ProductSlider
                  title={"Top Deals"}
                  setCartProductItem={setCartProductItem}
                  cartProductItem={cartProductItem}
                  cartProducts={props.cartProducts}
                  setCartProducts={props.setCartProducts}
                  page_number={3}
                  price_sort={"ASC"}
                  vendor_id={productDetails.vendor_id}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  tagName={""}
                />
              ) : (
                ""
              )}
            </Box>
            <Box
              sx={{
                mt: 4,
                mb: 4,
                p: 3,
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            >
              <Box
                className="d-flex"
                sx={{ borderBottom: "1px solid #ccc", pb: 3 }}
              >
                <HelpIcon
                  sx={{
                    width: "25px",
                    height: "25px",
                    mr: 3,
                    color: "var(--textgreen)",
                  }}
                />
                <Typography
                  fontSize="16px"
                  lineHeight="20px"
                  variant="subtitle1"
                  component={"p"}
                >
                  Support 24/7 <br />
                  Call us anytime
                </Typography>
              </Box>
              <Box
                className="d-flex"
                sx={{ borderBottom: "1px solid #ccc", py: 3 }}
              >
                <CreditCardIcon
                  sx={{
                    width: "25px",
                    height: "25px",
                    mr: 3,
                    color: "var(--textgreen)",
                  }}
                />
                <Typography
                  fontSize="16px"
                  lineHeight="20px"
                  variant="subtitle1"
                  component={"p"}
                >
                  100% Safety <br />
                  Only secure payments
                </Typography>
              </Box>
              <Box className="d-flex" sx={{ pt: 3 }}>
                <LocalOfferIcon
                  sx={{
                    width: "25px",
                    height: "25px",
                    mr: 3,
                    color: "var(--textgreen)",
                  }}
                />
                <Typography
                  fontSize="16px"
                  lineHeight="20px"
                  variant="subtitle1"
                  component={"p"}
                >
                  Hot Offers <br />
                  Discounts up to 80%
                </Typography>
              </Box>
            </Box>
            <CardContent>
              {writeReview == 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => setWriteReview(1)}
                    size="small"
                    style={{
                      border: "1px solid #000000cc",
                      color: "#000000cc",
                      paddingTop: "3px !important",
                      paddingBottom: "3px !important",
                      width: "100%",
                    }}
                    variant="outlined"
                  >
                    Write your review
                  </Button>
                </Box>
              )}
              {writeReview == 1 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 0,
                    }}
                  >
                    <StyledRating
                      defaultValue={rateValue.star}
                      value={rateValue.star}
                      size="large"
                      IconContainerComponent={IconContainer}
                      highlightSelectedOnly
                      onChange={(event, val) => {
                        setRateValue({ ...rateValue, star: val });
                      }}
                    />
                  </Box>
                  <Box fullwidth="true">
                    <TextareaAutosize
                      minRows={3}
                      placeholder="Write your review"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        width: "100%",
                        borderRadius: "12px 12px 0 12px",
                      }}
                      defaultValue={rateValue.msg}
                      onChange={(e) =>
                        setRateValue({ ...rateValue, msg: e.target.value })
                      }
                    />
                  </Box>
                  {rateValue.msg.length > 0 && rateValue.star > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="button"
                        size="small"
                        style={{
                          backgroundColor: "#000000cc",
                          color: "#fff",
                          paddingTop: "3px !important",
                          paddingBottom: "3px !important",
                        }}
                        variant="contained"
                        onClick={submitReview}
                      >
                        Submit Review
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Container>

          {cartItems > 0 && <FooterCart cart_items={cartItems} />}
          <Snackbar
            open={snack.open}
            autoHideDuration={6000}
            onClose={snackClose}
            message={snack.message}
            sx={{ marginBottom: cartItems > 0 ? "55px" : "2px" }}
          />
        </>
      )}
    </>
  );
};

// Skeleton
const showSkeleton = () => {
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          {new Array(3).fill(0).map((el, index) => {
            return (
              <Grid key={index} item xs={12}>
                <Skeleton
                  animation="wave"
                  width="100%"
                  style={{ height: "180px", marginTop: "-50px" }}
                />
                <Box sx={{ marginTop: "-25px" }}>
                  <Skeleton
                    animation="wave"
                    width="70%"
                    style={{ height: "20px" }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    animation="wave"
                    width="90%"
                    style={{ height: "20px" }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    animation="wave"
                    width="60%"
                    style={{ height: "20px" }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    animation="wave"
                    width="100%"
                    style={{ height: "60px", marginTop: "-5px" }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};
