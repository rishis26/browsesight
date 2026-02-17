import React, { useState } from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Permissions from "../components/Permissions";
import Comparison from "../components/Comparison";
import ApiDocs from "../components/ApiDocs";
import Footer from "../components/Footer";
import InstallationLayout from "../components/InstallationLayout";
import TermsModal from "../components/TermsModal";
import ImageModal from "../components/ImageModal";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleAccept = () => {
    setShowModal(false);
    // Trigger the actual download
    window.location.href = "/Browsesight.zip";
  };

  const openImageModal = (img, title) => {
    setSelectedImage({ img, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col w-full">
      <main className="flex-grow">
        <Hero onDownloadClick={handleDownloadClick} />
        <HowItWorks />
        <Permissions />
        <ApiDocs />
        <InstallationLayout
          onImageClick={openImageModal}
          onDownloadClick={handleDownloadClick}
        />
        <Comparison />
      </main>
      <Footer />

      {/* Image Lightbox Modal */}
      <ImageModal image={selectedImage} onClose={closeImageModal} />

      {/* Terms Acceptance Modal */}
      {showModal && (
        <TermsModal
          onClose={() => setShowModal(false)}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
};

export default HomePage;
