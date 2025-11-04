import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/CoupleStory.css";

// React component styled with CSS and enhanced with Framer Motion animations + parallax
export default function CoupleStory() {
  const navigate = useNavigate();
  return (
    <div className="site-container">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">C&amp;M</div>
          <nav className="nav-links">
            <a href="#schedule">Schedule</a>
            <a href="#location">Location</a>
            <a href="#faq">FAQ</a>
            <a href="#registry">Registry</a>
          </nav>
          <button className="menu-button" onClick={() => navigate("/")}>Menu</button>
        </div>
      </header>

      {/* Hero */}
      <main className="main-content">
        <section className="hero">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>
              CLAUDIA &amp; <span>MARIJN</span>
            </h1>
            <p className="subtitle">We're getting married</p>

            <div className="info-boxes">
              <motion.div
                className="info-box"
                whileHover={{ scale: 1.05 }}
              >
                <div className="info-label">Wedding Date</div>
                <div className="info-value">June 6, 2026</div>
              </motion.div>
              <motion.div
                className="info-box"
                whileHover={{ scale: 1.05 }}
              >
                <div className="info-label">Location</div>
                <div className="info-value">
                  Castello di Gabbiano — Florence, Italy
                </div>
              </motion.div>
            </div>

            <div className="hero-buttons">
              <motion.a
                href="#rsvp"
                className="button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RSVP
              </motion.a>
              <motion.a
                href="#travel"
                className="button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Travel &amp; Stay
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="hero-image parallax"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <div className="image-placeholder">Hero image</div>
          </motion.div>
        </section>

        <hr className="divider" />

        {/* Schedule */}
        <section id="schedule" className="section">
          <h2>Wedding Weekend Schedule</h2>
          <div className="schedule-grid">
            {[
              { label: "Welcome Dinner", date: "June 5, 2026" },
              { label: "Wedding Day", date: "June 6, 2026" },
              { label: "Pool Party", date: "June 7, 2026" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="schedule-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="schedule-label">{item.label}</div>
                <div className="schedule-date">{item.date}</div>
                <div className="schedule-location">Castello di Gabbiano</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section id="location" className="section parallax">
          <h2>Wedding Location</h2>
          <p className="location-address">
            Via Gabbiano, 22, 50020 Mercatale In Val di Pesa, Florence, Italy
          </p>
          <motion.div
            className="map-placeholder"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Map placeholder
          </motion.div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <h2>FAQ</h2>
          {[
            {
              q: "Dress Code",
              a: (
                <ul>
                  <li>Welcome Dinner: Cocktail Attire</li>
                  <li>Wedding Day: Black Tie</li>
                  <li>Pool Party: Casual</li>
                </ul>
              ),
            },
            {
              q: "Guests with Children",
              a: (
                <p>
                  Children are welcome for the Welcome Dinner and Pool Party.
                  The wedding day has separate childcare arrangements.
                </p>
              ),
            },
            {
              q: "Travel & Lodging",
              a: (
                <p>
                  See our Travel & Stay page for hotel suggestions and transport
                  options to the venue.
                </p>
              ),
            },
          ].map((faq, i) => (
            <motion.details
              key={i}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <summary>{faq.q}</summary>
              {faq.a}
            </motion.details>
          ))}
        </section>

        {/* Registry */}
        <section id="registry" className="section">
          <h2>Registry</h2>
          <p>
            Many of you are traveling across the globe to celebrate — your
            presence is the greatest gift. If you'd like to contribute, please
            visit our registry.
          </p>
          <motion.a
            href="#"
            className="button secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Visit Registry
          </motion.a>
        </section>

        {/* Footer */}
        <footer className="footer">
          C&amp;M — Looking forward to celebrating with you
        </footer>
      </main>
    </div>
  );
}
