import React, { useState } from "react";
import "./termsAndCondition.css";

const TermsAndCondition = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="terms-container">
      <div className="container">
        <h1 className="terms-title" onClick={() => setIsOpen(!isOpen)}>
          Terms and condition
        </h1>
        <div className="icon">
          <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`}></i>
        </div>
      </div>
      <div className={`terms-content ${isOpen ? "" : "closed"}`}>
        <p className="terms-paragraph">
          Welcome to <span className="domdom"> DOMDOM </span> - custom T-shirt
          design website. This site is provided as a service to our visitors and
          may be used for informational purposes only. Because the Terms and
          Conditions contain legal obligations, please read them carefully.
        </p>

        <div className="terms-section">
          <h2 className="section-title">1. YOUR AGREEMENT</h2>
          <p className="terms-paragraph">
            By using this Site, you agree to be bound by, and to comply with,
            these Terms and Conditions. If you do not agree to these Terms and
            Conditions, please do not use this site.
          </p>
          <p className="terms-paragraph">
            PLEASE NOTE: We reserve the right, at our sole discretion, to
            change, modify or otherwise alter these Terms and Conditions at any
            time. Unless otherwise indicated, amendments will become effective
            immediately. Please review these Terms and Conditions periodically.
            Your continued use of the Site following the posting of changes
            and/or modifications will constitute your acceptance of the revised
            Terms and Conditions and the reasonableness of these standards for
            notice of changes. For your information, this page was last updated
            as of the date at the top of these terms and conditions.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">2. PRIVACY</h2>
          <p className="terms-paragraph">
            Please review our Privacy Policy, which also governs your visit to
            this Site, to understand our practices.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">3. LINKED SITES</h2>
          <p className="terms-paragraph">
            This Site may contain links to other independent third-party Web
            sites ("Linked Sites"). These Linked Sites are provided solely as a
            convenience to our visitors. Such Linked Sites are not under our
            control, and we are not responsible for and does not endorse the
            content of such Linked Sites, including any information or materials
            contained on such Linked Sites. You will need to make your own
            independent judgment regarding your interaction with these Linked
            Sites.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">4. FORWARD LOOKING STATEMENTS</h2>
          <p className="terms-paragraph">
            All materials reproduced on this site speak as of the original date
            of publication or filing. The fact that a document is available on
            this site does not mean that the information contained in such
            document has not been modified or superseded by events or by a
            subsequent document or filing. We have no duty or policy to update
            any information or statements contained on this site and, therefore,
            such information or statements should not be relied upon as being
            current as of the date you access this site.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">
            5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
          </h2>
          <p className="terms-paragraph">
            A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE
            DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR
            THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER
            INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY
            UNDERSTAND AND AGREE THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY
            RELIANCE ON ANY SUCH OPINION, ADVICE, STATEMENT, MEMORANDUM, OR
            INFORMATION CONTAINED HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE
            SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS; (iii)
            EXCEPT AS EXPRESSLY PROVIDED HEREIN WE DISCLAIM ALL WARRANTIES OF
            ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, WORKMANLIKE EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE
            MAKE NO WARRANTY WITH RESPECT TO THE RESULTS THAT MAY BE OBTAINED
            FROM THIS SITE, THE
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
