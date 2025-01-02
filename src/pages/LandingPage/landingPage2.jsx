import React, { useState, useRef, useEffect } from "react";
import "./landingPage.css";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VerifiedIcon from "@mui/icons-material/Verified";
import fireflyImage from "../../assets/images/firefly2.png";
import cloud2Img from "../../assets/images/cloud-new2.png";
import cloud3Img from "../../assets/images/cloud-new3.png";
import cloud4Img from "../../assets/images/cloud-new4.png";
import cloud5Img from "../../assets/images/cloud-new5.png";
import cloud6Img from "../../assets/images/cloud-new6.png";
import cloud7Img from "../../assets/images/cloud-new14.png";
import cloud8Img from "../../assets/images/cloud-new8.png";
import cloud10Img from "../../assets/images/cloud-new12.png";
import cloud11Img from "../../assets/images/cloud-new15.png";
import grass from "../../assets/images/grass.png";
import tree1 from "../../assets/images/tree-1.png";
import tree3 from "../../assets/images/ggdrive2.png";
import mountain from "../../assets/images/ggdrive.png";
import mountainStar from "../../assets/images/star2.png";
import cloud13Img from "../../assets/images/cloud-new10.png";
import { useNavigate } from "react-router-dom";
import FeedbackSection from "../../components/feedbackSection";
import axios from "axios";
import GoogleAd from "../../components/GoogleAd/GoogleAd";
import AdSense from "../../components/GoogleAd/GoogleAd";
import DevAdsense from "../../components/GoogleAd/GoogleAd";
import AdComponent from "../../components/AdsHorizontal/adsHorizontal";

const features = [
  {
    icon: <AccessibleForwardIcon />,
    title: "Trending Collection",
    description:
      "we offer many different types of fashionable pre-designed T-Shirts",
  },
  {
    icon: <AccessibleForwardIcon />,
    title: "NFTs Integration",
    description: "for an exclusive and unique T-shirt designs",
  },
  {
    icon: <AccessibleForwardIcon />,
    title: "AI & Paint Tools",
    description: "creative and easy T-shirt design",
  },
];

const steps = [
  {
    number: 1,
    title: "Design",
    description:
      "Create your dream design with our intuitive tools and endless creative options. Our AI will guide you every step of the way.",
  },
  {
    number: 2,
    title: "Preview",
    description:
      "See your design come to life! Our virtual 3D model will showcase your t-shirt in stunning detail.",
  },
  {
    number: 3,
    title: "Finalize",
    description:
      "Add your desired T-shirt to your shopping cart and complete checkout process",
  },
];

const faqs = [
  {
    question: "How can I return my newly bought T-shirt?",
    answer:
      "To return a T-shirt, please initiate a return within 30 days of purchase. Log in to your account, navigate to 'Orders,' select the item, and choose the 'Return' option. We will provide a shipping label and instructions for completing your return.",
  },
  {
    question: "Tell me steps to order a product?",
    answer:
      "To order a product, simply browse our catalog and select the T-shirt you want. Choose your size, color, and any customizations, then click 'Add to Cart.' Proceed to checkout, enter your shipping information, and complete the payment process. You’ll receive a confirmation email shortly.",
  },
  {
    question: "How are your T-shirts printed?",
    answer:
      "Our T-shirts are printed using high-quality, eco-friendly inks and advanced digital printing technology, which ensures vibrant colors and durability. Each T-shirt is printed on demand, allowing us to focus on quality and reduce waste.",
  },
  {
    question: "What is your T-shirt material?",
    answer:
      "We use premium, 100% organic cotton for our T-shirts, ensuring softness, breathability, and durability. Our material is sustainably sourced and designed to provide comfort while being gentle on the environment.",
  },
];

const LandingPage = () => {
  const [openQuestion, setOpenQuestion] = useState(0);
  const sectionRefs = useRef([]);
  const [fireflyPosition, setFireflyPosition] = useState({ x: 0, y: 0 });
  const [isLanded, setIsLanded] = useState(false);
  const [moonPosition, setMoonPosition] = useState(-30);
  const fireflyWrapperRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(null);
  const [tShirts, setTShirts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  const fetchFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:3005/feedback");

      console.log("feedback data", response.data);
      setFeedbackData(response.data);
    } catch (err) {
      console.error("Error while fetching feedback:", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetch4SellingShirt = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3005/order/top-selling"
      );
      console.log("Top Selling Shirts:", response.data);
      setTShirts(response.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch top-selling shirts");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetch4SellingShirt();
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, []);
  useEffect(() => {
    // const observerOptions = {
    //   root: null,
    //   rootMargin: "0px",
    //   threshold: 0.15,
    // };

    // const observerCallback = (entries) => {
    //   entries.forEach((entry) => {
    //     if (entry.isIntersecting) {
    //       entry.target.classList.add("section-visible");
    //     }
    //   });
    // };
    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });
    return () => {
      sectionRefs.current.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
  // firefly
  useEffect(() => {
    const getDomDomPosition = () => {
      const headerTexts = document.querySelectorAll(".custom-text");
      const domdomText = Array.from(headerTexts).find((el) =>
        el.textContent.includes("DOMDOM")
      );
      if (domdomText) {
        const textRect = domdomText.getBoundingClientRect();
        // Position for the first O
        return {
          x: textRect.left + textRect.width * 0.359,
          y: textRect.top + textRect.height / 6.99,
        };
      }
      return { x: window.innerWidth / 2, y: window.innerHeight / 4 };
    };
    // Get tree position
    const getTreePosition = () => {
      const leftTree = document.querySelector(".tree3");
      if (leftTree) {
        const treeRect = leftTree.getBoundingClientRect();
        return {
          x: treeRect.left + treeRect.width * 0.27,
          y: treeRect.top + treeRect.height * 0.47,
        };
      }
      return {
        x: window.innerWidth * 0.2,
        y: document.body.scrollHeight - 200,
      };
    };

    const handleScroll = () => {
      const startPos = getDomDomPosition();
      const endPos = getTreePosition();
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min(scrollPosition / maxScroll, 1);

      const isNearBottom = scrollPercentage > 0.95;
      setIsLanded(isNearBottom);

      const amplitude = isNearBottom ? 0 : 100;
      const frequency = 5; //ban dau la 3
      // const xOffset =
      //   amplitude * Math.sin(scrollPercentage * Math.PI * frequency);
      const secondaryAmplitude = isNearBottom ? 0 : 30;
      const secondaryFrequency = 8;

      const xOffset =
        amplitude * Math.sin(scrollPercentage * Math.PI * frequency) +
        secondaryAmplitude *
          Math.cos(scrollPercentage * Math.PI * secondaryFrequency);
      let newX, newY;
      if (isNearBottom) {
        newX = endPos.x;
        newY = endPos.y;
      } else {
        newX =
          startPos.x + (endPos.x - startPos.x) * scrollPercentage + xOffset;
        newY = Math.max(
          startPos.y + (endPos.y - startPos.y) * scrollPercentage,
          100
        );
      }

      const viewportX = (newX / window.innerWidth) * 100;
      const viewportY = (newY / window.innerHeight) * 100;

      setFireflyPosition({ x: viewportX, y: viewportY });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min(scrollPosition / maxScroll, 1);

      let newMoonPosition = scrollPercentage * 100;

      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const moonHeight = 34;
        if (footerRect.top - moonHeight <= 0) {
          newMoonPosition =
            (footerRect.top / window.innerHeight) * 100 - moonHeight;
        }
      }

      setMoonPosition(newMoonPosition);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleBuyingClick = (tshirt) => {
    const product = tshirt.product;
    navigate(`/collection/${tshirt._id}`, { state: { product } });
  };
  const calculateSalePrice = (isSale, salePercent, price) => {
    if (isSale) {
      return price * (1 - salePercent / 100);
    }
    return price;
  };

  return (
    <div className="landing-page">
      <div className="firefly-container">
        <div
          ref={fireflyWrapperRef}
          className={`firefly-wrapper ${isLanded ? "firefly-landing" : ""}`}
          style={{
            left: `${fireflyPosition.x}%`,
            top: `${fireflyPosition.y}%`,
            position: isLanded ? "absolute" : "fixed",
          }}
        >
          <div className="firefly-glow" />
          <img
            src={fireflyImage}
            alt="firefly"
            className={`firefly-img ${isLanded ? "" : "firefly-flying"}`}
          />
        </div>
      </div>
      <div
        className="moon"
        style={{
          position: "fixed",
          // top: `${moonPosition}%`,
          // right: "33%",
          zIndex: -10,
          transform: "translateX(-0%) translateY(20%)",
          transition: "top 0.1s ease-out",
        }}
      >
        <img
          style={{ width: "34%", height: "34%", mixBlendMode: "screen" }}
          src={require("../../assets/images/moon.png")}
          alt="moon"
          className="moon-img"
        />
      </div>
      <meta name="google-adsense-account" content="ca-pub-8031141340234257"></meta>
      <header ref={addToRefs} className="hero section-hidden">
        <div className="cloud-container">
          <img src={cloud2Img} alt="cloud" className="cloud cloud-2" />
          <img src={cloud3Img} alt="cloud" className="cloud cloud-3" />
          <img src={cloud4Img} alt="cloud" className="cloud cloud-4" />
          <img src={cloud6Img} alt="cloud" className="cloud cloud-6" />
          <img src={cloud7Img} alt="cloud" className="cloud cloud-7" />
          {/* <img src={cloud8Img} alt="cloud" className="cloud cloud-8" /> */}
          <img src={cloud5Img} alt="cloud" className="cloud cloud-5" />
          <img src={cloud10Img} alt="cloud" className="cloud cloud-10" />
          <img src={cloud11Img} alt="cloud" className="cloud cloud-11" />
        </div>
        <div className="cloud star_1">
          <img
            style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
            src={require("../../assets/images/star-new.png")}
            alt="star"
            className="star-img"
          />
        </div>

        <div className="text-container">
          <h1 className="custom-text">CUSTOM T-SHIRT</h1>
          <h1 className="custom-text">DOMDOM</h1>
        </div>
        <p>You can design and buy your desired T-Shirt with AI from now on!</p>
        <button
          onClick={() => {
            navigate("/design");
          }}
          className="design-now-btn"
        >
          Design Now
        </button>
      </header>

      <section ref={addToRefs} className="features">
        <div className="cloud-container">
          {" "}
          <img src={cloud8Img} alt="cloud" className="cloud cloud-8" />
        </div>
        <h2>T-Shirt Design for Your Creative Ventures</h2>
        <p>
          Unleash your creativity with our versatile design tools, perfect for
          any T-Shirt ideas you have in mind.
        </p>
        <div className="feature-list">
          <span>Download</span>
          <span>Digital Payment</span>
          <span>Pain Tools</span>
          <span>AI</span>
          <span>NFT</span>
        </div>
      </section>
      {/* best selling section */}

      <section ref={addToRefs} className="best-selling section-hidden">
        <div className="best-selling-header">
          <div>
            <h2>Best Selling T-Shirt</h2>
            <p>Start buying your favourite trending T-Shirt</p>
            {/* <button className="see-more-btn">See more</button> */}
            <BtnComponent
              handleClick={() => {}}
              value={"See more"}
              width={110}
              height={35}
            ></BtnComponent>
          </div>
        </div>
        <div className="t-shirt-grid">
          {tShirts.map((tShirt) => (
            <div
              onClick={() => handleBuyingClick(tShirt)}
              key={tShirt._id}
              className="t-shirt-item"
            >
              <div
                className="t-shirt-image"
                style={{
                  backgroundImage: `url(${tShirt.imageUrl[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>{" "}
              <p className="t-shirt-name">{tShirt.name}</p>
              <p className="t-shirt-price">
                Price:
                <span className="original-price">
                  {tShirt.price.toLocaleString()} đ VND
                </span>
                <span className="sale-price">
                  {calculateSalePrice(
                    tShirt.isSale,
                    tShirt.salePercent,
                    tShirt.price
                  ).toLocaleString()}
                  đ
                </span>
              </p>
              <p className="t-shirt-price">Sold: {tShirt.totalQuantitySold}</p>
            </div>
          ))}
        </div>
        <img src={cloud13Img} alt="cloud" className="cloud cloud-13" />
      </section>
      {/* <div>
      <AdComponent />
      </div> */}
      {/* about us section */}
      <section ref={addToRefs} className="about-us section-hidden">
        <h2>ABOUT US</h2>
        <p className="about-description">
          Brief introduction about our website and services
        </p>
        <div className="about-features">
          {features.map((feature, index) => (
            <div key={index} className="feature">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* voucher section */}
      {/* <section ref={addToRefs} className="voucher-section section-hidden">
        <h2>VOUCHER</h2>
        <p className="voucher-description">
          We provide vouchers for cheaper deals
        </p>
        <div className="voucher-grid">
          {vouchers.map((voucher, index) => (
            <div key={index} className="voucher-item">
              <h3>{voucher.discount}</h3>
              <p className="for-text">{voucher.forText}</p>
              <div className="voucher-code">
                <span>Code: {voucher.code}</span>
                <div className="copy-btn">
                  <ContentCopyIcon />
                  <Typography>Copy</Typography>
                </div>
                <div className="apply-btn">
                  <VerifiedIcon />
                  <Typography>Apply</Typography>
                </div>
              </div>
              <p className="validity">
                • {voucher.validFrom} - {voucher.validTo}
              </p>
              <p className="for-products">• {voucher.forProducts}</p>
            </div>
          ))}
        </div>
        <button className="see-more-btn">See more</button>
        <img src={cloud12Img} alt="cloud" className="cloud cloud-12" />
      </section> */}
      {/* guidance section */}
      <section ref={addToRefs} className="guidance-section section-hidden">
        <h2>GUIDANCE FOR FIRST-TIME VISITORS</h2>
        <p className="guidance-description">Easy and simple process</p>
        <h3 className="process-title">Personalized Design Process</h3>
        <div className="guidance-content">
          <div className="t-shirt-preview"></div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-arrow">{step.number}</div>
                <div className="step-text">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* feedback section */}
      <section ref={addToRefs} className="feedback-section section-hidden">
        <h2>FEEDBACK BY OUR CUSTOMERS</h2>
        <p className="faq-description">
          Feedback us anytime after buying products
        </p>
        <FeedbackSection
          feedbacks={feedbackData}
          onFeedbackUpdate={setFeedbackData}
        />
      </section>
      {/* faq section */}
      <section ref={addToRefs} className="faq-section section-hidden">
        <h2>FREQUENTLY ASKED QUESTIONS</h2>
        <p className="faq-description">
          Contact us anytime if you have other questions
        </p>
        <div className="faq-container">
          <div className="faq-support">
            <h3>Support</h3>
            <p>For further question, please contact email below</p>
            <p className="any-questions">ANY QUESTIONS</p>
            <a href="mailto:bichngoc@cht.edu.vn" className="support-email">
              domdom@fakeemail.com
            </a>
          </div>
          <div className="faq-questions">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3>{faq.question}</h3>
                  <span
                    className={`faq-toggle ${
                      openQuestion === index ? "open" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                {openQuestion === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="star_1">
          <img
            style={{
              width: "200%",
              height: "100%",
              mixBlendMode: "screen",
              opacity: "0.5",
              filter: "blur(0.2px)",
              transform: "translateX(-20%)",
            }}
            src={require("../../assets/images/shooting-star.png")}
            alt="star"
            className="star-img"
          />
        </div>
      </section> 
      <div>
      {/* <AdSense /> */}
      <DevAdsense />

      </div>

      {/* <script>
          {(adsbygoogle = window.adsbygoogle || []).push({})}
      </script> */}
      <footer ref={addToRefs} className="section-hidden">
        <div className="footer-content2">
          <h2>ENJOY YOUR EXPERIENCE WITH OUR WEBSITE</h2>
          <BtnComponent
            handleClick={() => {
              navigate("/collection");
            }}
            value={"Shop Now"}
            width={120}
            height={35}
          />
        </div>

        <div className="nature-container">
          <div className="left-tree">
            {/* <img src={tree4} alt="tree4" className="tree-img tree4" /> */}
            <img src={tree3} alt="tree3" className="tree-img tree3" />
          </div>
          <div className="right-trees">
            <img src={tree1} alt="tree2" className="tree-img tree2" />
            <img src={tree3} alt="tree1" className="tree-img tree1" />
          </div>

          <div className="mountain-container">
            <img
              src={mountain}
              alt="mountain1"
              className="mountain-img mountain1"
            />
            <img
              src={mountain}
              alt="mountain2"
              className="mountain-img mountain2"
            />
          </div>
        </div>
        <img src={grass} alt="grass" className="grass1-img" />
        <img src={grass} alt="grass" className="grass2-img" />
        <div className="star_1">
          <img
            style={{
              width: "180%",
              height: "100%",
              mixBlendMode: "screen",
              transform: "translateX(-20%)",
            }}
            src={require("../../assets/images/star3.png")}
            alt="star"
            className="star-img"
          />
        </div>
        {/* <img src={grass2} alt="grass" className="grass2-img" /> */}

        <img src={mountainStar} alt="mountainStar" className="mountain-star" />
      </footer>
    </div>
  );
};

export default LandingPage;
