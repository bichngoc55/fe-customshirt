import React, { useState, useRef, useEffect } from "react";
import "./landingPage.css";
// import { FaFire, FaPaintBrush } from "react-icons/fa";
// import { SiNfc } from "react-icons/si";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import BtnComponent from "../../components/btnComponent/btnComponent";
import BtnCloud from "../../components/btnCloud/btnCloud";
import { Typography } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import fireflyImage from '../../assets/images/firefly2.png';
import cloud2Img from '../../assets/images/cloud2.png';
import cloud3Img from '../../assets/images/cloud3.png';
import cloud4Img from '../../assets/images/cloud4.png';
import cloud5Img from '../../assets/images/cloud5.png';
import cloud6Img from '../../assets/images/cloud6.png';
import cloud7Img from '../../assets/images/cloud7.png';
import cloud8Img from '../../assets/images/cloud8.png';
import grass from '../../assets/images/vegetation-grass-silhouette-69788.png';
import tree1 from '../../assets/images/tree-silhouette-2-3.png';
import tree2 from '../../assets/images/tree-silhouette-2-10-153x300.png';

const tShirts = [
  { id: 1, name: "UNDEFINED NAME", price: "₱ 1,400.00" },
  { id: 2, name: "UNDEFINED NAME", price: "₱ 900.00" },
  { id: 3, name: "UNDEFINED NAME", price: "₱ 3,500.00" },
  { id: 4, name: "UNDEFINED NAME", price: "₱ 3,500.00" },
];
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
const vouchers = [
  {
    discount: "5% OFF",
    forText: "FOR WHOLE ORDER",
    code: "CODE_123sksdlof",
    validFrom: "05/08/2021 04:00",
    validTo: "09/08/2021 12:00",
    forProducts: "For all products.",
  },
  {
    discount: "5% OFF",
    forText: "FOR WHOLE ORDER",
    code: "CODE_123sksdlof",
    validFrom: "05/08/2021 04:00",
    validTo: "09/08/2021 12:00",
    forProducts: "For all products.",
  },
  {
    discount: "5% OFF",
    forText: "FOR WHOLE ORDER",
    code: "CODE_123sksdlof",
    validFrom: "05/08/2021 04:00",
    validTo: "09/08/2021 12:00",
    forProducts: "For all products.",
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
    question: "How does product customization work?",
    answer:
      "To make a T-shirt design, your first need to install specific graphic design software. Once you've done that, start your creation your final design is at least 220 PPI so it won't be pixelated when printed... To design your own T-shirt, you can upload your design to the front of your tee and add custom elements like text. For some of our T-shirts, reverse side printing is also available.",
  },
  {
    question: "What products can I customize?",
    answer: "Answer for what products can be customized...",
  },
  {
    question: "How are your T-shirts printed?",
    answer: "Answer for how T-shirts are printed...",
  },
  {
    question: "What is the best T-shirt material?",
    answer: "Answer for the best T-shirt material...",
  },
];

const LandingPage = () => {
  const [openQuestion, setOpenQuestion] = useState(0);
  const sectionRefs = useRef([]);
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
  useEffect(() => {
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
    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });
    return () => {
      sectionRefs.current.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="landing-page">
      <header ref={addToRefs} className="hero section-hidden">
        {/* <div className="cloud-container">
          <BtnCloud top="10%" left="10%" imageUrl={cloud3Img} />
          <BtnCloud top="20%" left="30%"  imageUrl={cloud3Img} />
          <BtnCloud top="30%" left="80%"  imageUrl={cloud4Img} />
          <BtnCloud top="50%" left="100%"  imageUrl={cloud5Img} />
          <BtnCloud top="40%" left="50%"  imageUrl={cloud6Img} />
          <BtnCloud top="80%" left="50%" imageUrl={cloud7Img} />
        </div> */}
        <div className="cloud-container">
          {/* <img src={cloud2Img} alt="cloud" className="cloud cloud-2" /> */}
          <img src={cloud3Img} alt="cloud" className="cloud cloud-3" />
          <img src={cloud4Img} alt="cloud" className="cloud cloud-4" />
          <img src={cloud5Img} alt="cloud" className="cloud cloud-5" />
          <img src={cloud6Img} alt="cloud" className="cloud cloud-6" />
          <img src={cloud7Img} alt="cloud" className="cloud cloud-7" />
          <img src={cloud8Img} alt="cloud" className="cloud cloud-8" />
        </div>
        <div className="star_1">
          <img
          style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
              src={require("../../assets/images/star.png")}
              alt="star"
              className="star-img"
            />
        </div>
        {/* <div className="star_2">
          <img
          style={{ width: "50%", height: "100%", mixBlendMode: "screen" }}
              src={require("../../assets/images/star.png")}
              alt="star"
              className="star-img"
            />
        </div> */}
        <div className="moon">
          <img
            style={{ width: "34%", height: "34%", mixBlendMode: "screen" }}
            src={require("../../assets/images/moon.png")}
            alt="moon"
            className="moon-img"
          />
        </div>
        <div className="text-container">
          <h1 className="custom-text">CUSTOM T-SHIRT</h1>
          <h1 className="custom-text">
            D<span className="o-container">O<img src={fireflyImage} alt="firefly" className="firefly-img" /></span>MDOM
          </h1>
        </div>
        
        <p>You can design and buy your desired T-Shirt with AI from now on!</p>
        <button className="design-now-btn">Design Now</button>
      </header>

      <section ref={addToRefs} className="features section-hidden">
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
            <BtnComponent handleClick={()=>{}} value={"See more"} width={110} height={35} ></BtnComponent>
          </div>
        </div>
        <div className="t-shirt-grid">
          {tShirts.map((tShirt) => (
            <div key={tShirt.id} className="t-shirt-item">
              <div className="t-shirt-image"></div>
              <p className="t-shirt-name">{tShirt.name}</p>
              <p className="t-shirt-price">{tShirt.price}</p>
            </div>
          ))}
        </div>
      </section>
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
      <section ref={addToRefs} className="voucher-section section-hidden">
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
      </section>
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
            <a href="mailto:hello@teespace.com" className="support-email">
              hello@teespace.com
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
      </section>

      <footer ref={addToRefs} className="section-hidden">
        <h2>ENJOY YOUR EXPERIENCE WITH OUR WEBSITE</h2>
        <button className="cta-button">Shop Now</button>
        <section ref={addToRefs} className="nature-section section-hidden">
        <div className="grass-container">
          <img src={grass} alt="grass" className="grass-img" />
        </div>
        {/* <div className="trees-container">
          <img src={require(tree1)} alt="tree1" className="tree-img tree1" />
          <img src={require(tree2)} alt="tree2" className="tree-img tree2" />
          <img src={require(tree1)} alt="tree1" className="tree-img tree1" />
        </div> */}
      </section>
      </footer>
    </div>
  );
};

export default LandingPage;
