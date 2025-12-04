'use client';

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, LayoutTemplate } from 'lucide-react';
import Editor from './Editor';
import Preview from './Preview';
import AuthPopup from './AuthPopup';
import TemplatePopup from './TemplatePopup';
import styles from '../styles/ResumeBuilder.module.css';

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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);

  const fileInputRef = useRef(null);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resumeData.personal.name || 'Resume'}`,
    onAfterPrint: () => console.log('Print completed'),
    pageStyle: `
      @page {
        margin: 10mm;
        size: A4;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const handlePhotoClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleLogin = (provider, userData) => {
    console.log(`Logged in with ${provider}`, userData);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (userData) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: userData.fullName || prev.personal.name,
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => window.location.reload()}>
                  Clear
                </button>
                <button onClick={handlePrint} className={styles.button}>
                  <Download size={16} /> Download PDF
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
    </div>
  );
}
