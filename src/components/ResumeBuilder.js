'use client';

import React, { useState, useRef } from 'react';
import { Download, LayoutTemplate, User, LogOut, LogIn, Lock } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Editor from './Editor';
import Preview from './Preview';
import AuthPopup from './AuthPopup';
import TemplatePopup from './TemplatePopup';
import PolicyPopup from './PolicyPopup';
import styles from '../styles/ResumeBuilder.module.css';
import { TEMPLATES } from '../lib/templates';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personal: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: 'New York, NY',
      summary: 'Experienced software developer with a passion for building scalable web applications.',
      portfolio: '',
      github: '',
      linkedin: ''
    },
    education: [
      {
        id: 1,
        school: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        year: '2018 - 2022',
        description: 'Graduated with Honors. Member of the Coding Club.'
      }
    ],
    experience: [
      {
        id: 1,
        company: 'Tech Solutions Inc.',
        role: 'Frontend Developer',
        duration: '2022 - Present',
        description: 'Developing responsive web applications using React and Next.js. Collaborating with designers and backend engineers.'
      }
    ],
    skills: ['React', 'Next.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce application with payment integration.',
        link: 'https://github.com/johndoe/ecommerce'
      }
    ],
    profilePhoto: null,
    photoConfig: {
      shape: 'circle', // 'circle' | 'square'
      size: 'medium'   // 'small' | 'medium' | 'large'
    }
  });

  const { data: session, status, update } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('modernAts');
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [policyModal, setPolicyModal] = useState({ isOpen: false, key: null });

  const openPolicy = (e, key) => {
    e.preventDefault();
    setPolicyModal({ isOpen: true, key });
  };

  const activeTemplateData = TEMPLATES.find(t => t.id === activeTemplate);
  const isPremiumTemplate = activeTemplateData?.isPremium;
  const templatePrice = activeTemplateData?.price || 0;

  // Calculate if the user has an active subscription
  const hasActiveSubscription = Boolean(
    user?.isPremium &&
    user?.premiumExpiry &&
    new Date() < new Date(user.premiumExpiry)
  );

  const isLocked = Boolean(
    isPremiumTemplate &&
    !hasActiveSubscription &&
    !user?.purchasedTemplates?.includes(activeTemplate)
  );

  const fileInputRef = useRef(null);
  const componentRef = useRef(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (type = 'single') => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoadingPayment(true);
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoadingPayment(false);
      return;
    }

    const amountToCharge = type === 'subscription' ? 149 : templatePrice;

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToCharge }),
      });

      const data = await orderRes.json();

      if (!orderRes.ok) {
        alert(`Error: ${data.message || 'Payment setup failed.'}`);
        setLoadingPayment(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Resume Builder Pro',
        description: 'Unlock All Premium Templates',
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              templateId: type === 'single' ? activeTemplate : null,
              isSubscription: type === 'subscription'
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.status === 'success') {
            if (type === 'subscription') {
              alert('Payment Successful! 1-Month Premium Pass activated.');
              await update({
                isSubscriptionUpdate: true,
                premiumExpiry: verifyData.expiryDate
              });
            } else {
              alert('your resume temelept is unlocked a');
              await update({ purchasedTemplate: activeTemplate });
            }
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: { color: '#8b5cf6' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePrint = async () => {
    if (isLocked) {
      await handlePayment('single');
      return;
    }

    const originalTitle = document.title;
    document.title = `${resumeData.personal.name || 'Resume'}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  const handlePhotoClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleLogin = (provider, userData) => {
    console.log(`Logged in with ${provider}`, userData);
    setIsAuthModalOpen(false);

    if (userData) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: userData.name || prev.personal.name,
          email: userData.email || prev.personal.email,
        },
        profilePhoto: userData.profilePhotoUrl || prev.profilePhoto
      }));
    }

    // Automatically trigger file upload after login if no photo
    if (!userData?.profilePhotoUrl) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePhotoConfig = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      photoConfig: {
        ...prev.photoConfig,
        [field]: value
      }
    }));
  };

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), school: '', degree: '', year: '', description: '' }
      ]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), company: '', role: '', duration: '', description: '' }
      ]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), name: '', description: '', link: '' }
      ]
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateSkills = (value) => {
    // Split by comma and trim
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setResumeData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <AuthPopup
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <TemplatePopup
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentTemplate={activeTemplate}
        onSelectTemplate={(template) => {
          setActiveTemplate(template);
          setIsTemplateModalOpen(false);
        }}
      />

      <PolicyPopup
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal({ isOpen: false, key: null })}
        policyKey={policyModal.key}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Header */}
      <header className={styles.mainHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Resume Builder Pro
          </h1>
          <p className={styles.headerSubtitle}>Create your professional resume in minutes</p>
        </div>

        <div className={styles.headerActions}>
          {isAuthenticated ? (
            <div className={styles.userInfo}>
              <div className={styles.userBadge}>
                <User size={16} />
                <span>{user?.name || 'User'}</span>
              </div>
              <button onClick={handleLogout} className={`${styles.button} ${styles.logoutButton}`}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className={`${styles.button} ${styles.loginButton}`}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </header>

      <div className={styles.content}>
        {/* Editor Section */}
        <div className={styles.editorSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Resume
              </h2>
              <div className={styles.headerButtonGroup}>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => window.location.reload()}>
                  Clear
                </button>
                {isLocked && (
                  <button
                    onClick={() => handlePayment('subscription')}
                    className={`${styles.button}`}
                    style={{ background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', color: 'white', border: 'none' }}
                    disabled={loadingPayment}
                  >
                    <><Lock size={16} /> Unlock All (1 Month) - ₹149</>
                  </button>
                )}
                <button
                  onClick={handlePrint}
                  className={`${styles.button} ${isLocked ? styles.buttonLocked : ''}`}
                  disabled={loadingPayment}
                >
                  {loadingPayment ? (
                    'Processing...'
                  ) : isLocked ? (
                    <><Lock size={16} /> Unlock Template (₹{templatePrice})</>
                  ) : (
                    <><Download size={16} /> Download PDF</>
                  )}
                </button>
              </div>
            </div>
            <Editor
              data={resumeData}
              updatePersonal={updatePersonal}
              handlePhotoUpload={handlePhotoUpload}
              updatePhotoConfig={updatePhotoConfig}
              addEducation={addEducation}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              addExperience={addExperience}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
              addProject={addProject}
              updateProject={updateProject}
              removeProject={removeProject}
              updateSkills={updateSkills}
              showProfilePhoto={showProfilePhoto}
              setShowProfilePhoto={setShowProfilePhoto}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className={styles.previewSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Live Preview
              </h2>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className={`${styles.button} ${styles.buttonSecondary}`}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                <LayoutTemplate size={14} /> Change Template
              </button>
            </div>
            <div className={styles.previewBody}>
              <Preview
                ref={componentRef}
                data={resumeData}
                onPhotoClick={handlePhotoClick}
                activeTemplate={activeTemplate}
                showProfilePhoto={showProfilePhoto}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" onClick={(e) => openPolicy(e, 'privacy')} className={styles.footerLink}>Privacy Policy</a>
          <a href="#" onClick={(e) => openPolicy(e, 'terms')} className={styles.footerLink}>Terms of Service</a>
          <a href="#" onClick={(e) => openPolicy(e, 'refund')} className={styles.footerLink}>Refund Policy</a>
          <a href="#" onClick={(e) => openPolicy(e, 'contact')} className={styles.footerLink}>Contact Us</a>
        </div>
        <p className={styles.footerText}>
          <strong>Note:</strong> Digital products are non-refundable.
        </p>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} Resume Builder Pro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
