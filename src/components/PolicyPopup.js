import React from 'react';
import { X } from 'lucide-react';
import styles from '../styles/AuthPopup.module.css';

const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    content: "At Resume Builder Pro, we value your privacy. We collect basic information like your name, email, and the professional details you enter to generate your resume. We do not sell your data to third parties. All payment information is handled securely by Razorpay, and we do not store your credit card or UPI details on our servers."
  },
  terms: {
    title: 'Terms of Service',
    content: "By using Resume Builder Pro, you agree to provide accurate information for your resume. We provide the tools to create professional documents, but we are not responsible for the content you enter. You agree not to use our service for any illegal or fraudulent activities."
  },
  refund: {
    title: 'Refund Policy',
    content: "Since our resumes are digital products and are delivered immediately upon purchase, we follow a strict no-refund policy. Once you pay to unlock a template or download a PDF, the sale is final. Please use our 'Preview' feature to ensure your resume is perfect before making a payment."
  },
  contact: {
    title: 'Contact Us',
    content: "For any support, technical issues, or payment queries, please reach out to us at:\n\nEmail: durgamsaishankargoud0702@gmail.com\n\nResponse Time: We aim to respond to all inquiries within 24-48 hours."
  }
};

export default function PolicyPopup({ isOpen, onClose, policyKey }) {
  if (!isOpen || !policyKey || !POLICIES[policyKey]) return null;

  const policy = POLICIES[policyKey];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {policy.title}
        </h2>
        
        <div style={{
          color: '#4b5563',
          lineHeight: '1.6',
          fontSize: '1rem',
          whiteSpace: 'pre-wrap',
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: '0.5rem'
        }}>
          {policy.content}
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
